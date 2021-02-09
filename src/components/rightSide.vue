<template>
    <div class="right" ref="rootDiv">
        <div class="mCanvas" :style="mCanvasStyle" ref="mCan" @mouseleave="hoverItemType = ''">
            <div :style="bgStyle" @mouseover="onBgOver"></div>
            <div v-for="(item,index) in imgItems"
                :style="{
                    transform: `translate(${item.left}px,${item.top}px)`,
                    width: `${item.viewportWidth}px`,
                    height: `${item.viewportHeight}px`,
                    zIndex: index+1
                }" :key="index" class="imgIttem" @mouseover="onItemOver(index)">
                <img :src="item.src" alt="0" :style="{width: `${item.viewportWidth}px`,height: `${item.viewportHeight}px`}">
            </div>

            <div class="hoverGizmo" :style="hoverGizmoStyle"></div>
        </div>
        <button @click="addtest">Add</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            canvWidth: 0,
            mCanvasStyle: {},
            bgStyle: {},
            hoverItemType: '',
            hoverItemIndex: null,
            
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
    },
    computed: {
        percentItemWidth() {
            return Math.ceil(this.canvWidth * 30 / 100);
        },
        hoverGizmoStyle(){
            switch (this.hoverItemType) {
                case 'bg':
                    return {
                        top: `0px`,
                        left: `0px`,
                        width: `100%`,
                        height: `100%`,
                    }
                case 'item':
                    return {
                        top: `${this.imgItems[this.hoverItemIndex].top}px`,
                        left: `${this.imgItems[this.hoverItemIndex].left}px`,
                        width: `${this.imgItems[this.hoverItemIndex].viewportWidth}px`,
                        height: `${this.imgItems[this.hoverItemIndex].viewportHeight}px`,
                    }
                default:
                    return {
                        display: 'none'
                    }
            }
        },
    },
    methods: {
        addtest() {
            let obj = {
                src: 'https://cs8.pikabu.ru/post_img/big/2017/11/20/8/151118095313281056.jpg',
                width: 1080,
                height: 821,
                viewportWidth: 0,
                viewportHeight: 0,
                top: 100,
                left: 200,
            }
            obj.viewportWidth = this.percentItemWidth;
            obj.viewportHeight = obj.viewportWidth * obj.height / obj.width;
            this.imgItems.push(obj);
            obj = {
                src: 'https://cs8.pikabu.ru/post_img/big/2017/11/20/8/151118095313281056.jpg',
                width: 1080,
                height: 821,
                viewportWidth: 0,
                viewportHeight: 0,
                top: 300,
                left: 600,
            }
            obj.viewportWidth = this.percentItemWidth;
            obj.viewportHeight = obj.viewportWidth * obj.height / obj.width;
            this.imgItems.push(obj);
        },
        onBgOver(){
            this.hoverItemType = 'bg';
        },
        onItemOver(index){
            this.hoverItemType = 'item';
            this.hoverItemIndex = index;
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
    }
    .mCanvas{
        background-color: rgba(221, 221, 221, 0.652);
        box-shadow: 0 0 35px 11px #0000001c;
        position: absolute;
        top: 50%;
        left: 50%;
    }
    .imgIttem{
        position: absolute;
        user-select: none;
    }
    .imgIttem img{
        pointer-events: none;
    }
    .hoverGizmo{
        position: absolute;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 0 0 2px #aaa inset;
    }
</style>