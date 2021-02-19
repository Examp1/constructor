<template>
    <div class="root" ref="roodDiv">
        <div class="cropbody" ref="cropBody"
            :class="{moving: isMoving}"
            @mousedown="onCBMDown"
            @touchstart.stop.prevent="onCBMDown">
            <img :src="img" alt="1" :style="imgStyle" ref="srcImg">
        </div>
        <div class="zoom">
            <input type="range" v-model="zoom" :min="minZoom" max="4" step="0.01">
        </div>
        <div class="btns">
            <button @click="onCanselBtn">отмена</button>
            <button @click="onSaveBtn">сохранить</button>
        </div>
        <div ref="tst"></div>
    </div>
</template>

<script>
import Bus from '../main.js';
export default {
    data() {
        return {
            zoom: 1,
            minZoom: 0,
            oW: 0,
            oH: 0,
            ix: 0,
            iy: 0,
            isMoving: false,
            vSize: {},
            img: null,

            pointerProps: {},
        }
    },
    mounted () {
        this.img = this.$store.state.photoOriginal.src;
        let oi = this.$store.state.photoOriginal;
        this.oW = oi.width;
        this.oH = oi.height;
        let cb = this.$refs.cropBody;
        let cbW = cb.clientWidth;
        let cbH = cb.clientHeight;
        this.vSize = {
            w: cbW,
            h: cbH,
        };
        this.ix = cbW/2;
        this.iy = cbH/2;

        let minSizeLength = this.oW > this.oH ? this.oH : this.oW;
        this.minZoom = parseFloat(+(this.vSize.w / minSizeLength).toFixed('3'));
        this.zoom = this.minZoom;

        let tc = document.createElement('canvas');
        tc.width = this.vSize.w;
        tc.height = this.vSize.h;
        let tctx = tc.getContext('2d');
        tctx.fillStyle = 'blue';
        tctx.fillRect(0,0, tc.width, tc.height);
        tctx.globalCompositeOperation = 'destination-out';
        tctx.arc(tc.width/2, tc.height/2, tc.width/2, 0, 2 * Math.PI);
        
    },
    computed: {
        imgStyle() {
            return {
                width: `${this.iW}px`,
                height: `${this.iH}px`,
                top: `${this.iy - this.iH/2}px`,
                left: `${this.ix - this.iW/2}px`,
            }
        },
        iW(){
            return this.oW * +this.zoom;
        },
        iH(){
            return this.oH * +this.zoom;
        },
    },
    methods: {
        onCanselBtn(){
            this.$store.dispatch('CANSEL_CROP');
        },
        onSaveBtn(){
            let owz = (this.oW * this.zoom);
            let ohz = (this.oH * this.zoom);

            let startX = this.ix - this.iW/2;
            let sXP = startX * 100 / owz;
            startX = Math.abs(sXP * this.oW / 100);

            let startY = this.iy - this.iH/2;
            let xYP = startY * 100 / ohz;
            startY = Math.abs(xYP * this.oH / 100);

            let cWidthPercent = this.vSize.w * 100 / owz;
            let cWidth = Math.floor(this.oW * cWidthPercent / 100);
            
            console.log(startX, startY, cWidth);

            let c = document.createElement('canvas')
            c.width = 600;
            c.height = 600;
            let ctx = c.getContext('2d');

            ctx.save();
            ctx.beginPath();
            ctx.arc(300, 300, 300, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(this.$refs.srcImg, startX, startY, cWidth, cWidth,
                            0, 0, 600, 600);

            ctx.beginPath();
            ctx.arc(300, 300, 300, 0, Math.PI * 2, true);
            ctx.clip();
            ctx.closePath();
            ctx.restore();

            this.$store.commit('SET_CROPED_PHOTO', {
                photo: c.toDataURL('image/png')
            });
            Bus.$emit('onCropedImgAdd', {});
        },
        onCBMDown(e) {
            this.isMoving = true;
            this.pointerProps.startPos = {
                x: e.pageX || e.touches[0].pageX,
                y: e.pageY || e.touches[0].pageY,
            };
            this.pointerProps.startImgPos = {
                x: this.ix,
                y: this.iy,
            };
            this.$refs.cropBody.addEventListener('mousemove', this.onCBMMove);
            this.$refs.cropBody.addEventListener('touchmove', this.onCBMMove, true);
            this.$refs.cropBody.addEventListener('mouseup', this.onCBMUp);
            this.$refs.cropBody.addEventListener('touchend', this.onCBMUp, true);
        },
        onCBMMove(e){
            this.pointerProps.movePos = {
                x: e.pageX || e.touches[0].pageX,
                y: e.pageY || e.touches[0].pageY,
            };
            let delta = {
                x: this.pointerProps.movePos.x - this.pointerProps.startPos.x,
                y: this.pointerProps.movePos.y - this.pointerProps.startPos.y,
            };
            let dx = this.pointerProps.startImgPos.x - -delta.x;
            let dy = this.pointerProps.startImgPos.y - -delta.y;
            if(dx > this.iW/2){
                dx = this.iW/2;
            }
            if(dx < this.vSize.w - this.iW/2){
                dx =  this.vSize.w - this.iW/2;
            }
            if(dy > this.iH/2){
                dy = this.iH/2;
            }
            if(dy < this.vSize.h - this.iH/2){
                dy = this.vSize.h - this.iH/2
            }
            this.ix = dx;
            this.iy = dy;
        },
        onCBMUp(e){
            this.isMoving = false;
            this.$refs.cropBody.removeEventListener('mousemove', this.onCBMMove);
            this.$refs.cropBody.removeEventListener('mouseup', this.onCBMUp);
        },
    },
    watch: {
        zoom(){
            let dx = this.ix;
            let dy = this.iy;
            if(dx > this.iW/2){
                dx = this.iW/2;
            }
            if(dx < this.vSize.w - this.iW/2){
                dx =  this.vSize.w - this.iW/2;
            }
            if(dy > this.iH/2){
                dy = this.iH/2;
            }
            if(dy < this.vSize.h - this.iH/2){
                dy = this.vSize.h - this.iH/2
            }
            this.ix = dx;
            this.iy = dy;
        }
    },
}
</script>

<style scoped lang="scss">
    .root{
        background-color: #f6f6f6;
        width: 100%;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .cropbody{
            // незя менять размеры зоны с кропом
            width: 200px;
            height: 200px;
            background-color: rgb(220, 220, 220);
            position: relative;
            overflow: hidden;
            user-select: none;
            img{
                position: absolute;
                user-select: none;
                z-index: 1;
            }
            &:before{
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 5;
                cursor: move;
            }
            &:after{
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background-image:url("/img/circle.svg");
                background-repeat: no-repeat;
                background-size: 100% 100%;
                z-index: 2;
            }
            &.moving{
                &:before{
                    position: fixed;
                }
            }
        }
        .zoom{
            input{
                width: 305px;
            }
        }
    }
</style>