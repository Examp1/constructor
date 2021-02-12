<template>
    <div class="right" ref="rootDiv">
        <button @click="test">add</button>
        <div class="rootClickHandler" @click.stop="rootClick" ref="rootClickHandler"></div>
        <div class="mCanvas" :style="mCanvasStyle"  ref="mCan" :class="{dropOver: isDropOver}" @mouseleave="hoverItemType = ''" @drop="onDrop" @dragover="allowDrop" @dragleave="onDragLeave">
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
        </div>
        <div class="gizmoOverlay" :style="mCanvasStyle">
            <div class="hoverGizmo" :style="hoverGizmoStyle"></div>
            <div class="selectGizmo" :style="selectGizmoStyle">
                <template v-if="selectedItemType == 'item'">
                    <div class="tl" @mousedown.stop.prevent="gizmoDown('tl', $event)" @touchstart.stop.prevent="gizmoDown('tl', $event)"></div>
                    <div class="tr" @mousedown.stop.prevent="gizmoDown('tr', $event)" @touchstart.stop.prevent="gizmoDown('tr', $event)"></div>
                    <div class="bl" @mousedown.stop.prevent="gizmoDown('bl', $event)" @touchstart.stop.prevent="gizmoDown('bl', $event)"></div>
                    <div class="br" @mousedown.stop.prevent="gizmoDown('br', $event)" @touchstart.stop.prevent="gizmoDown('br', $event)"></div>
                    <div class="ro" @mousedown.stop.prevent="gizmoDown('ro', $event)" @touchstart.stop.prevent="gizmoDown('ro', $event)">rotate</div>
                    <!-- <div class="move" @mousedown.stop.prevent="gizmoDownMove($event)" @touchstart.stop.prevent="gizmoDownMove($event)">move</div> -->
                </template>
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
            bgStyle: {},
            hoverItemType: '',
            hoverItemIndex: null,
            selectedItemType: '',
            selectedItemIndex: null,

            gizmoHoverSticks: null,
            gizmoSticks: null,
            imgVm: null,

            isDropOver: false,
            
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
        this.$store.commit('SET_ORIG_SIZE', {
            width: canW,
            height: canH,
        })
        this.bgStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: '#fff',
            zIndex: 0,
        };
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
        
        this.$refs.rootDiv.addEventListener('wheel', (e) => {
            if(e.ctrlKey){
                e.preventDefault();
                let deltaY = -e.deltaY;
                if(this.$store.state.canvasZoom > 0.3 && deltaY < 0){
                    this.$store.commit('SET_CURRENT_ZOOM', {
                        zoom: +(this.$store.state.canvasZoom + deltaY * 0.001).toFixed(2)
                    });
                }
                if(this.$store.state.canvasZoom < 2 && deltaY > 0){
                    this.$store.commit('SET_CURRENT_ZOOM', {
                        zoom: +(this.$store.state.canvasZoom + deltaY * 0.001).toFixed(2)
                    });
                }
            }
        });
    },
    computed: {
        mCanvasStyle(){
            return {
                width: `${this.$store.state.origWidth}px`,
                height: `${this.$store.state.origHeight}px`,
                transform: `translate(-50%, -50%) scale(${this.$store.state.canvasZoom})`,
            }
        },
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
            if(e.target == this.$refs.rootClickHandler){
                this.selectedItemType = '';
            }
        },
        itemChange(e){
            console.log(e);
        },
        gizmoDown(stick, ev){
            this.imgVm.stickDown(stick, ev)
        },
        gizmoDownMove(ev){
            this.imgVm.bodyMouseDown(ev)
        },
        onDrop(e){
            let data = JSON.parse(e.dataTransfer.getData("dragInfo"));
            let obj = {
                src: data.src,
                width: data.width,
                height: data.height,
                viewportWidth: data.viewportWidth,
                viewportHeight: data.viewportHeight,
                top: e.offsetY,
                left: e.offsetX,
                angle: 0
            }
            if(obj.viewportWidth == 0 || obj.viewportHeight == 0){
                obj.viewportWidth = 300;
                obj.viewportHeight = 300;
            }
            obj.top = obj.top - obj.viewportHeight/2;
            obj.left = obj.left - obj.viewportWidth/2;
            this.imgItems.push(obj);
            this.isDropOver = false;
        },
        allowDrop(e){
            e.preventDefault();
            Bus.$emit('canvasDropOvered', {});
            this.isDropOver = true;
        },
        onDragLeave(){
            Bus.$emit('canvasDropLeave', {});
            this.isDropOver = false;
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
        overflow: auto;
    }
    .rootClickHandler{
        position: absolute;
        z-index: 1;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
    }
    .mCanvas{
        background-color: rgba(221, 221, 221, 0.652);
        box-shadow: 0 0 35px 11px #0000001c;
        position: absolute;
        top: 50%;
        left: 50%;
        overflow: hidden;
        z-index: 10;
        &.dropOver{
            .drr{
                pointer-events: none !important;
            }
        }
    }
    .gizmoOverlay{
        position: absolute;
        top: 50%;
        left: 50%;
        pointer-events: none;
        z-index: 15;
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
        .tl, .tr, .bl, .br, .ro, .move{
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
            transform: translate(calc(-50% ), -50%);
        }
        .move{
            top: -30px;
            left: 50%;
            transform: translate(calc(-50% + 20px), -50%);
        }
    }
</style>