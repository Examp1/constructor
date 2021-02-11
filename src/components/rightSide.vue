<template>
    <div class="right" ref="rootDiv" @click.stop="rootClick">
        <button @click="test">add</button>
        <div class="mCanvas" :style="mCanvasStyle" ref="mCan" @mouseleave="hoverItemType = ''" @drop="onDrop" @dragover="allowDrop" @dragleave="onDragover">
            <div :style="bgStyle" @mouseover="onBgOver" @click="onBgClick"></div>
            <drr v-for="(item,index) in imgItems" :key="index" :ref="`item${index}`"
                :ind="index"
                :x="item.left + item.viewportWidth/2"
                :y="item.top + item.viewportHeight/2"
                :w="item.viewportWidth"
                :h="item.viewportHeight"
                :angle="item.angle"
                :aspectRatio="true"
                
                @click="onItemClick(index)"
                @mouseover="onItemOver(index)">
                <img :src="item.src" alt="item" style="width:100%; height:100%">
            </drr>
            <!-- <div v-for="(item,index) in imgItems"
                :style="{
                    transform: `translate(${item.left}px,${item.top}px)`,
                    width: `${item.viewportWidth}px`,
                    height: `${item.viewportHeight}px`,
                    zIndex: index+1
                }" :key="index" class="imgIttem" @mouseover="onItemOver(index)" @click="onItemClick(index)">
                <img :src="item.src" alt="item" :style="{width: `${item.viewportWidth}px`,height: `${item.viewportHeight}px`}">
            </div> -->

        </div>
        <div class="gizmoOverlay" :style="mCanvasStyle">
            <div class="hoverGizmo" :style="hoverGizmoStyle"></div>
            <div class="selectGizmo" :style="selectGizmoStyle">
                <div class="tl" @mousedown.stop.prevent="gizmoDown('tl', $event)" @touchstart.stop.prevent="gizmoDown('tl', $event)"></div>
                <div class="tr" @mousedown.stop.prevent="gizmoDown('tr', $event)" @touchstart.stop.prevent="gizmoDown('tr', $event)"></div>
                <div class="bl" @mousedown.stop.prevent="gizmoDown('bl', $event)" @touchstart.stop.prevent="gizmoDown('bl', $event)"></div>
                <div class="br" @mousedown.stop.prevent="gizmoDown('br', $event)" @touchstart.stop.prevent="gizmoDown('br', $event)"></div>
                <div class="ro" @mousedown.stop.prevent="gizmoDown('ro', $event)" @touchstart.stop.prevent="gizmoDown('ro', $event)"></div>
            </div>
        </div>
    </div>
</template>

<script>
import drr from './drr'
import Bus from '../main.js'
export default {
    components: {
        drr,
    },
    data() {
        return {
            canvWidth: 0,
            mCanvasStyle: {},
            bgStyle: {},
            hoverItemType: '',
            hoverItemIndex: null,
            selectedItemType: '',
            selectedItemIndex: null,

            gizmoHoverSticks: null,
            gizmoSticks: null,
            imgVm: null,
            
            imgItems: [],
        }
    },
    mounted () {
        let margin = 100;
        let rD = this.$refs.rootDiv;
        //TODO: если зона будет уже по высоте - расчитать от высоты
        let canW = rD.offsetWidth - margin*2;
        let canH = Math.ceil(canW * 10 / 19); // соотношение 19:10
        this.canvWidth = canW;
        this.mCanvasStyle = {
            width: `${canW}px`,
            height: `${canH}px`,
            transform: `translate(-50%, -50%)`,
        }
        this.bgStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: '#fff',
            zIndex: 0,
        }
        Bus.$on('updateGizmo', (ev) => {
            this.selectedItemType = 'item';
            this.selectedItemIndex = ev.data.index;
            this.gizmoSticks = ev.data;
            this.imgVm = ev.vm;
        });
        Bus.$on('updateGizmoHover', (ev) => {
            this.gizmoHoverSticks = ev.data;
            this.hoverItemIndex = ev.data.index;
            this.hoverItemType = 'item';
        });
        
    },
    computed: {
        percentItemWidth() {
            return Math.ceil(this.canvWidth * 30 / 100);
        },
        hoverGizmoStyle(){
            switch (this.hoverItemType) {
                case 'bg':
                    if(this.selectedItemType != 'bg')
                        return {
                            top: `0px`,
                            left: `0px`,
                            width: `100%`,
                            height: `100%`,
                        }
                    else
                        return {
                            display: 'none'
                        }
                case 'item':
                    if(this.selectedItemType == 'item'){
                        if(this.hoverItemIndex != this.selectedItemIndex)
                            return {
                                top: `${this.gizmoHoverSticks.top-this.gizmoHoverSticks.height/2}px`,
                                left: `${this.gizmoHoverSticks.left-this.gizmoHoverSticks.width/2}px`,
                                width: `${this.gizmoHoverSticks.width}px`,
                                height: `${this.gizmoHoverSticks.height}px`,
                                transform: `rotate(${this.gizmoHoverSticks.angle}deg)`
                            }
                        else
                            return {
                                display: 'none'
                            }
                    }
                    else{
                        return {
                            top: `${this.gizmoHoverSticks.top-this.gizmoHoverSticks.height/2}px`,
                            left: `${this.gizmoHoverSticks.left-this.gizmoHoverSticks.width/2}px`,
                            width: `${this.gizmoHoverSticks.width}px`,
                            height: `${this.gizmoHoverSticks.height}px`,
                            transform: `rotate(${this.gizmoHoverSticks.angle}deg)`
                        }
                    }
                default:
                    return {
                        display: 'none'
                    }
            }
        },
        selectGizmoStyle(){
            switch (this.selectedItemType) {
                case 'bg':
                    return {
                        top: `0px`,
                        left: `0px`,
                        width: `100%`,
                        height: `100%`,
                    }
                case 'item':
                    return {
                        top: `${this.gizmoSticks.top-this.gizmoSticks.height/2}px`,
                        left: `${this.gizmoSticks.left-this.gizmoSticks.width/2}px`,
                        width: `${this.gizmoSticks.width}px`,
                        height: `${this.gizmoSticks.height}px`,
                        transform: `rotate(${this.gizmoSticks.angle}deg)`
                    }
                default:
                    return {
                        display: 'none'
                    }
            }
        },
    },
    methods: {
        test(e){
            let obj = {
                src: 'https://cs8.pikabu.ru/post_img/big/2017/11/20/8/151118095313281056.jpg',
                width: 300,
                height: 300,
                viewportWidth: 0,
                viewportHeight: 0,
                top: 100,
                left: 100,
                angle: 0
            }
            obj.viewportWidth = this.percentItemWidth;
            obj.viewportHeight = Math.ceil(obj.viewportWidth * obj.height / obj.width);
            obj.top = obj.top - obj.viewportHeight/2;
            obj.left = obj.left - obj.viewportWidth/2;
            this.imgItems.push(obj);
        },
        onBgOver(){
            this.hoverItemType = 'bg';
        },
        onItemOver(index){
            this.hoverItemType = 'item';
            this.hoverItemIndex = index;
        },
        onItemClick(index){
            this.selectedItemType = 'item';
            this.selectedItemIndex = index;
        },
        onBgClick(){
            this.selectedItemType = 'bg';
        },
        rootClick(e){
            if(e.target == this.$refs.rootDiv) this.selectedItemType = '';
        },
        itemChange(e){
            console.log(e);
            
        },
        gizmoDown(stick, ev){
            this.imgVm.stickDown(stick, ev)
        },
        onDrop(e){
            let data = JSON.parse(e.dataTransfer.getData("obj"));
            let obj = {
                src: data.src,
                width: data.width,
                height: data.height,
                viewportWidth: 0,
                viewportHeight: 0,
                top: e.offsetY,
                left: e.offsetX,
                angle: 0
            }
            obj.viewportWidth = this.percentItemWidth;
            obj.viewportHeight = Math.ceil(obj.viewportWidth * obj.height / obj.width);
            obj.top = obj.top - obj.viewportHeight/2;
            obj.left = obj.left - obj.viewportWidth/2;
            this.imgItems.push(obj);
        },
        allowDrop(e){
            e.preventDefault();
            Bus.$emit('canvasDropOvered', {});
        },
        onDragover(){
            Bus.$emit('canvasDropLeave', {});
        },
    },
}
</script>

<style scoped lang="scss">
    .right  {
        width: calc(70% - 10px);
        height: 100vh;
        background-color: #f0f0f0;
        position: relative;
        user-select: none;
    }
    .mCanvas{
        background-color: rgba(221, 221, 221, 0.652);
        box-shadow: 0 0 35px 11px #0000001c;
        position: absolute;
        top: 50%;
        left: 50%;
        overflow: hidden;
    }
    .gizmoOverlay{
        position: absolute;
        top: 50%;
        left: 50%;
        pointer-events: none;
    }
    .imgIttem{
        position: absolute;
        user-select: none;
        img{
            pointer-events: none;
        }
    }
    .hoverGizmo{
        position: absolute;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 0 0 2px rgb(131, 255, 100) inset;
    }
    .selectGizmo{
        position: absolute;
        z-index: 1001;
        box-sizing: content-box;
        pointer-events: none;
        &:before{
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border: 2px dashed rgb(47, 182, 255);
        }
        .tl, .tr, .bl, .br, .ro{
            background-color: rgb(47, 182, 255);
            width: 18px;
            height: 18px;
            border-radius: 50%;
            position: absolute;
            pointer-events: auto;
            cursor: pointer;
        }
        .tl{
            top: 0;
            left: 0;
            transform: translate(-50%, -50%);
        }
        .tr{
            top: 0;
            right: 0;
            transform: translate(50%, -50%);
        }
        .bl{
            bottom: 0;
            left: 0;
            transform: translate(-50%, 50%);
        }
        .br{
            bottom: 0;
            right: 0;
            transform: translate(50%, 50%);
        }
        .ro{
            top: -30px;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
</style>