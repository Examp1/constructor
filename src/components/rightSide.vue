<template>
    <div class="right" ref="rootDiv"
        v-hammer:pinch="onPinch"
        v-hammer:pinchstart="onPinchStart">
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
                
                @contextmenu="onItemContext($event)"
                v-hammer:press="onPress"
                @change="imgItemChanged($event, index)"
                @click="onItemClick(index)"
                @touchstart.stop.prevent="onItemClick(index)"
                @mouseover="onItemOver(index)">
                <img :src="item.src" alt="item" style="width:100%; height:100%">
            </drr>
            <img src="/img/icon_watermark.svg" alt="wt" class="waterm" :style="watermStyle">
        </div>
        <div class="gizmoOverlay" :style="mCanvasStyle">
            <div class="hoverGizmo" :style="hoverGizmoStyle"></div>
            <div class="selectGizmo" :style="selectGizmoStyle">
                <template v-if="selectedItemType == 'item'">
                    <div class="tl" @mousedown.stop.prevent="gizmoDown('tl', $event)" @touchstart.stop.prevent="gizmoDown('tl', $event)" :style="`transform: translate(-50%, -50%) scale(${gizmoScale})`"></div>
                    <div class="tr" @mousedown.stop.prevent="gizmoDown('tr', $event)" @touchstart.stop.prevent="gizmoDown('tr', $event)" :style="`transform: translate(50%, -50%) scale(${gizmoScale})`"></div>
                    <div class="bl" @mousedown.stop.prevent="gizmoDown('bl', $event)" @touchstart.stop.prevent="gizmoDown('bl', $event)" :style="`transform: translate(-50%, 50%) scale(${gizmoScale})`"></div>
                    <div class="br" @mousedown.stop.prevent="gizmoDown('br', $event)" @touchstart.stop.prevent="gizmoDown('br', $event)" :style="`transform: translate(50%, 50%) scale(${gizmoScale})`"></div>
                    <div class="ro" @mousedown.stop.prevent="gizmoDown('ro', $event)" @touchstart.stop.prevent="gizmoDown('ro', $event)" :style="`transform: translate(-50%, 0) scale(${gizmoScale})`">
                        <i class="ic-icon_6"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                    </div>
                    <div class="move" @mousedown.stop.prevent="gizmoDownMove($event)" @touchstart.stop.prevent="gizmoDownMove($event)" :style="`transform: translate(-50%, 0) scale(${gizmoScale})`">
                        <i class="ic-icon_4"><span class="path1"></span><span class="path2"></span></i>
                    </div>
                </template>
            </div>
        </div>
        <div v-if="isContext" class="contextMenu" :style="contextMenuStyle">
            <button @click="changeOrder(0, selectedItemIndex)">На передний план</button>
            <button @click="changeOrder(1, selectedItemIndex)">На задний план</button>
        </div>
        <div class="orientBtn">
            <button :disabled="orient == 'h'" @click="changeOrient('h')">
                <span>Горизонт</span>
                <svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 21"><defs></defs><path class="cls-1" d="M14.75,3.57l2.78.69A.44.44,0,0,0,18,4a.3.3,0,0,0,0-.1.44.44,0,0,0-.32-.53L15.91,3a4.08,4.08,0,0,1,4.3-.38A3.91,3.91,0,0,1,22.32,6.8a.44.44,0,0,0,.36.51h.08a.45.45,0,0,0,.4-.24.56.56,0,0,0,0-.12,4.88,4.88,0,0,0-5.65-5.63A5,5,0,0,0,15.84,2L16.39.7a.44.44,0,0,0-.23-.58.45.45,0,0,0-.58.23L14.44,2.94a.4.4,0,0,0,0,.37A.42.42,0,0,0,14.75,3.57Zm.05-.21Z"/><path class="cls-1" d="M13.1,8.1V0H0V21H25V8.1ZM11.8,1.28V19.72H1.3V1.28Zm1.3,8.1H23.67V19.72H13.1Z"/></svg>
            </button>
            <button :disabled="orient == 'v'" @click="changeOrient('v')">
                <span>Вертикаль</span>
                <svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 21"><defs></defs><path class="cls-1" d="M14.7,2.28A.46.46,0,0,0,15,2.19,4,4,0,0,1,19.8,2a4,4,0,0,1,1.71,3.9L20.23,4.54a.41.41,0,0,0-.31-.14.42.42,0,0,0-.32.11l-.07.08a.42.42,0,0,0,0,.54l1.94,2.08a.46.46,0,0,0,.31.14h0a.51.51,0,0,0,.36-.17L24,5a.43.43,0,0,0-.07-.61.45.45,0,0,0-.63.07l-.85,1.07a4.64,4.64,0,0,0-.26-1.77h0A4.78,4.78,0,0,0,20.3,1.28a5,5,0,0,0-5.84.23.24.24,0,0,0-.08.09.42.42,0,0,0,0,.52A.43.43,0,0,0,14.7,2.28Z"/><path class="cls-1" d="M13.1,8.1V0H0V21H25V8.1ZM3.68,19.72H1.3V1.28H11.8V8.1H3.68Zm1.3,0V9.38H23.7V19.72Z"/></svg>
            </button>
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
            bgSrc: '#a1d7de',
            hoverItemType: '',
            hoverItemIndex: null,
            selectedItemType: '',
            selectedItemIndex: null,
            isContext: false,
            sceneLastScale: '',

            orient: 'h',

            gizmoHoverSticks: null,
            gizmoSticks: null,
            imgVm: null,
            contextMenuStyle: {},

            isDropOver: false,
            isTemplate: false,
            templateGroup: '',
            
            imgItems: [],
        }
    },
    mounted () {
        this.calculateCanvasSize();
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
        Bus.$on('canvasUndo', () => {
            this.onUndo();
        });
        Bus.$on('onCropedImgAdd', () => {
            let obj = {
                src: this.$store.state.cropedBase64,
                width: 600,
                height: 600,
                viewportWidth: 100,
                viewportHeight: 100,
                top: this.$store.state.origHeight / 2,
                left: this.$store.state.origWidth / 2,
                angle: 0
            }
            if(obj.viewportWidth == 0 || obj.viewportHeight == 0){
                obj.viewportWidth = 300;
                obj.viewportHeight = 300;
            }
            obj.top = obj.top - obj.viewportHeight/2;
            obj.left = obj.left - obj.viewportWidth/2;
            this.imgItems.push(obj);
            
            this.pushState();
        });
        Bus.$on('addElementByClick', (dragInfo) => {
            let obj = {
                src: dragInfo.src,
                width: dragInfo.width,
                height: dragInfo.height,
                viewportWidth: dragInfo.viewportWidth,
                viewportHeight: dragInfo.viewportHeight,
                left: this.$store.state.origWidth/2 - dragInfo.viewportWidth / 2,
                top: this.$store.state.origHeight/2 - dragInfo.viewportHeight / 2,
                angle: 0
            }
            this.imgItems.push(obj);
            this.pushState();
        });
        Bus.$on('setTemplateByClick', (dragInfo) => {
            this.changeOrient(dragInfo.orient, false);
            this.bgSrc = dragInfo.bgSrc;
            let tempTexts = [];
            dragInfo.texts.forEach( txtItem => {
                let obj = {};
                obj.src = txtItem.src;
                obj.width = txtItem.orWidth;
                obj.height = txtItem.orHeight;
                obj.angle = 0;
                obj.viewportWidth =  this.$store.state.origWidth * txtItem.width / 100;
                obj.viewportHeight = txtItem.orHeight * obj.viewportWidth / txtItem.orWidth;
                obj.left = (this.$store.state.origWidth * txtItem.pos.x / 100) - obj.viewportWidth/2;
                obj.top = (this.$store.state.origHeight * txtItem.pos.y / 100) - obj.viewportHeight/2;
                tempTexts.push(obj);
            })
            // Очищать при применении шаблона?
            this.imgItems = [...tempTexts];
            this.isTemplate = true;
            this.templateGroup = dragInfo.group;
            this.pushState();
        });
        Bus.$on('setBgColorByClick', (color) => {
            this.bgSrc = color;
            if(this.isTemplate)
                this.imgItems = [];
            this.isTemplate = false;
            this.pushState();
        });
        Bus.$on('canvasCopy', () => {
            if(this.selectedItemType == 'item' && this.selectedItemIndex > -1){
                let newItem = JSON.parse(JSON.stringify(this.imgItems[this.selectedItemIndex]));
                newItem.left = this.$store.state.origWidth/2 - newItem.viewportWidth / 2;
                newItem.top  = this.$store.state.origHeight/2 - newItem.viewportHeight / 2;
                this.imgItems.push(newItem);
                this.pushState();
            }
        });
        Bus.$on('canvasDelete', () => {
            if(this.selectedItemType == 'item' && this.selectedItemIndex > -1){
                let array = this.imgItems;
                array.splice(this.selectedItemIndex, 1);
                this.imgItems = array;
                this.pushState();
                this.selectedItemType = '';
                this.$store.commit('SET_IS_SELECTED', {
                    val: false
                });
            }
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
        setTimeout(() => {
            this.calculateMaxSize();
        }, 500);
    },
    computed: {
        watermStyle(){
            return {
                position: 'absolute',
                top: `${this.$store.state.origWidth * 0.02}px`,
                right: `${this.$store.state.origWidth * 0.02}px`,
                width: `${this.$store.state.origWidth * 0.05}px`,
                zIndex: '1000',
                opacity: '0.5',
                pointerEvents: 'none',
            }
        },
        bgStyle(){
            if(/^#([a-fA-F0-9]){3}$|[a-fA-F0-9]{6}$/.test(this.bgSrc)){
                return {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    backgroundColor: this.bgSrc,
                    zIndex: 0,
                }
            } else if(this.bgSrc == ''){
                return {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    zIndex: 0,
                }
            } else{
                return {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    zIndex: 0,
                    right: 0,
                    backgroundImage: `url(${this.bgSrc})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                }
            }
        },
        gizmoScale(){
            // return Math.abs((2 - this.$store.state.canvasZoom));
            return 1;
        },
        mCanvasStyle(){
            if(!this.$store.state.isRender)
                return {
                    width: `${this.$store.state.origWidth}px`,
                    height: `${this.$store.state.origHeight}px`,
                    transform: `translate(-50%, -50%) scale(${this.$store.state.canvasZoom})`,
                    top: `50%`,
                    left: `50%`,
                }
            else
                return {
                    width: `${this.$store.state.origWidth}px`,
                    height: `${this.$store.state.origHeight}px`,
                }
        },
        // todo: delete this
        // percentItemWidth() {
        //     return Math.ceil(this.$store.state.origWidth * 30 / 100);
        // },
        hoverGizmoStyle(){
            switch (this.hoverItemType) {
                // case 'bg':
                //     if(this.selectedItemType != 'bg')
                //         return {
                //             top: `0px`,
                //             left: `0px`,
                //             width: `100%`,
                //             height: `100%`,
                //         }
                //     else
                //         return {
                //             display: 'none'
                //         }
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
                // case 'bg':
                //     return {
                //         top: `0px`,
                //         left: `0px`,
                //         width: `100%`,
                //         height: `100%`,
                //     }
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
        calculateMaxSize(){
            if(this.orient == 'h'){
                let l = +this.$refs.mCan.style.height.replace('px', '') * 0.7;
                this.$store.commit('SET_MAXSIZE', {
                    val: l
                });
            } else{
                let l = this.$refs.mCan.style.width.replace('px', '') * 0.7;
                this.$store.commit('SET_MAXSIZE', {
                    val: l
                });
            }
        },
        calculateCanvasSize(){
            let margin = 20;
            let rD = this.$refs.rootDiv;
            let canW, canH;
            if(this.orient == 'h'){
                //TODO: если зона будет уже по высоте - расчитать от высоты
                canW = rD.offsetWidth - margin*2;
                canH = Math.ceil(canW * 10 / 19); // соотношение 19:10
            }
            else{ // orient == 'v'
                canH = rD.offsetHeight - margin*2;
                canW = Math.ceil(canH * 83 / 120); // соотношение 120:83
            }
            this.canvWidth = canW;
            this.$store.commit('SET_ORIG_SIZE', {
                width: canW,
                height: canH,
            })
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
            this.$store.commit('SET_IS_SELECTED', {
                val: true
            });
        },
        onBgClick(){
            this.selectedItemType = 'bg';
            this.$store.commit('SET_IS_SELECTED', {
                val: false
            });
        },
        rootClick(e){
            if(e.target == this.$refs.rootClickHandler){
                this.selectedItemType = '';
            }
            this.$store.commit('SET_IS_SELECTED', {
                val: false
            });
        },
        imgItemChanged(e, index){
            // console.log(e, index);
            this.imgItems[index].angle = e.angle;
            this.imgItems[index].left = e.x - e.w/2;
            this.imgItems[index].top = e.y - e.h/2;
            this.imgItems[index].viewportWidth = e.w;
            this.imgItems[index].viewportHeight = e.h;

            this.pushState();
        },
        gizmoDown(stick, ev){
            this.imgVm.stickDown(stick, ev)
        },
        gizmoDownMove(ev){
            this.imgVm.bodyMouseDown(ev)
        },
        changeOrient(orient, save = true){
            switch (orient) {
                case 'v':
                    if(this.orient != 'v'){
                        this.orient = 'v';
                        let oldW = this.$store.state.origWidth;
                        let oldH = this.$store.state.origHeight;
                        this.calculateCanvasSize();
                        this.applyOrientTransform(oldW, oldH);
                        if(this.isTemplate){
                            let t = this.$store.state.templates.find(item => item.group == this.templateGroup && item.orient == 'v');
                            this.bgSrc = t.bg;
                        }
                        this.selectedItemType = '';
                        if(save)
                            this.pushState();
                    }
                    break;
                case 'h':
                    if(this.orient != 'h'){
                        this.orient = 'h';
                        let oldW = this.$store.state.origWidth;
                        let oldH = this.$store.state.origHeight;
                        this.calculateCanvasSize();
                        this.applyOrientTransform(oldW, oldH);
                        if(this.isTemplate){
                            let t = this.$store.state.templates.find(item => item.group == this.templateGroup && item.orient == 'h');
                            this.bgSrc = t.bg;
                        }
                        this.selectedItemType = '';
                        if(save)
                            this.pushState();
                    }
                    break;
            }
        },
        onItemContext(e){
            debugger
            if(this.imgItems.length > 1){
                e.preventDefault();
                let rootOffset = this.getOffset(this.$refs.rootDiv);
                let x = e.pageX - rootOffset.x;
                let y = e.pageY - rootOffset.y;
                this.contextMenuStyle = {
                    left: `${x}px`,
                    top: `${y}px`,
                };
                this.isContext = true;
                document.addEventListener('click', this.contextOutHandler);
            }
        },
        onPress(e){
            if(this.imgItems.length > 1){
                let rootOffset = this.getOffset(this.$refs.rootDiv);
                let x = e.center.x - rootOffset.x;
                let y = e.center.y - rootOffset.y;
                this.contextMenuStyle = {
                    left: `${x}px`,
                    top: `${y}px`,
                };
                this.isContext = true;
                document.addEventListener('click', this.contextOutHandler);
            }
        },
        onPinchStart(e){
            this.sceneLastScale = this.$store.state.canvasZoom;
            console.log('start ', this.sceneLastScale);
            
        },
        onPinch(e){
            let zoom = this.sceneLastScale * e.scale;
            if(zoom < 0.3) zoom = 0.3;
            if(zoom > 2) zoom = 2;
            this.$store.commit('SET_CURRENT_ZOOM', {
                zoom: zoom
            });
        },
        contextOutHandler(e){
            if(!(e.target.classList.contains('contextMenu') || e.target.closest('.contextMenu'))){
                this.isContext = false;
                document.removeEventListener('click', this.contextOutHandler)
            }
        },
        changeOrder(cmd, index){
            if(this.imgItems.length > 1 && index > -1){
                switch (cmd) {
                    case 1:
                        this.array_move(this.imgItems, index, 0);
                        this.selectedItemType = 'item';
                        this.selectedItemIndex = 0;
                        this.pushState();
                        break;
                    case 0:
                        this.array_move(this.imgItems, index, this.imgItems.length-1);
                        this.selectedItemIndex = this.imgItems.length-1;
                        this.selectedItemType = 'item';
                        this.pushState();
                        break;
                }
                this.isContext = false;
            }
        },
        array_move(arr, old_index, new_index) {
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        },
        applyOrientTransform(oldW, oldH){
            this.imgItems.forEach(item => {
                item.left = item.left * this.$store.state.origWidth / oldW;
                item.top = item.top * this.$store.state.origHeight / oldH;
            });
        },
        onDrop(e){
            try{
                let data = JSON.parse(e.dataTransfer.getData("dragInfo"));
                if(data.type == 'sticker' || data.type == 'text'){
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
                    this.pushState();
                }
                else if(data.type == 'template'){
                    this.changeOrient(data.orient, false);
                    this.bgSrc = data.bgSrc;
                    let tempTexts = [];
                    data.texts.forEach( txtItem => {
                        let obj = {};
                        obj.src = txtItem.src;
                        obj.width = txtItem.orWidth;
                        obj.height = txtItem.orHeight;
                        obj.angle = 0;
                        obj.viewportWidth =  this.$store.state.origWidth * txtItem.width / 100;
                        obj.viewportHeight = txtItem.orHeight * obj.viewportWidth / txtItem.orWidth;
                        obj.left = (this.$store.state.origWidth * txtItem.pos.x / 100) - obj.viewportWidth/2;
                        obj.top = (this.$store.state.origHeight * txtItem.pos.y / 100) - obj.viewportHeight/2;
                        tempTexts.push(obj);
                    })
                    // Очищать при применении шаблона?
                    this.imgItems = [...tempTexts];
                    this.isTemplate = true;
                    this.templateGroup = data.group;
                    this.pushState();
                }
                else if(data.type == 'color'){
                    this.bgSrc = data.color;
                    if(this.isTemplate)
                        this.imgItems = [];
                    this.imgItems = [];
                    this.isTemplate = false;
                    this.pushState();
                }
            }
            catch(e){
                console.warn(e);
            }
            finally{
                this.isDropOver = false;
            }
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
        getOffset( elem ){
            let rect = elem.getBoundingClientRect();
            let scrollLeft  = window.pageXOffset || document.documentElement.scrollLeft;
            let scrollTop   = window.pageYOffset || document.documentElement.scrollTop;
            return {
                x: rect.left + scrollLeft,
                y: rect.top + scrollTop
            }
        },
        pushState(){
            this.$store.commit('SET_CAN_CROP', {
                val: this.imgItems.length > 0
            });
            setTimeout(() => {
                this.calculateMaxSize();
            }, 500);
            this.$store.commit('PUSH_STATE', {
                state: {
                    imgItems: JSON.parse(JSON.stringify(this.imgItems)),
                    orient: this.orient,
                    bgSrc: this.bgSrc,
                }
            });
        },
        onUndo(){
            this.$store.commit('REVERT_STATE', {});
            let st = JSON.parse(JSON.stringify(this.$store.state.states[this.$store.state.states.length-1]));
            let orient = st.orient;
            if(this.orient != orient){
                switch (orient) {
                    case 'v':
                        if(this.orient != 'v'){
                            this.orient = 'v';
                            let oldW = this.$store.state.origWidth;
                            let oldH = this.$store.state.origHeight;
                            this.calculateCanvasSize();
                            this.applyOrientTransform(oldW, oldH);
                            this.selectedItemType = '';
                        }
                        break;
                    case 'h':
                        if(this.orient != 'h'){
                            this.orient = 'h';
                            let oldW = this.$store.state.origWidth;
                            let oldH = this.$store.state.origHeight;
                            this.calculateCanvasSize();
                            this.applyOrientTransform(oldW, oldH);
                            this.selectedItemType = '';
                        }
                        break;
                }
            }
            this.imgItems = st.imgItems;
            this.$store.commit('SET_CAN_CROP', {
                val: this.imgItems.length > 0
            });
            this.bgSrc = st.bgSrc;
            this.selectedItemType = '';
            this.$store.commit('SET_IS_SELECTED', {
                val: false
            });
        },
    },
}
</script>

<style    scoped lang="scss">
    .right  {
        width: calc(100% - 490px);
        height: calc(100vh - 88px);
        background-color: #f0f0f0;
        position: relative;
        user-select: none;
        overflow: auto;
        @media (max-width: 1024px) {
            width: 100%;
            height: calc(50vh - 66px);
            order: 2;
        }
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
        // box-shadow: 0 0 35px 11px #0000001c;
        position: absolute;
        // top: 50%;
        // left: 50%;
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
    .waterm{
        position: absolute;
        top: 20px;
        right: 20px;
        width: 60px;
        z-index: 1000;
        opacity: 0.5;
        pointer-events: none;
    }
    .hoverGizmo{
        position: absolute;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 0 0 1px #1e6dcf inset;
    }
    .selectGizmo{
        position: absolute;
        z-index: 1001;
        box-sizing: content-box;
        pointer-events: none;
        .ic-icon_6,
        .ic-icon_4{
            font-size: 25px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        &:before{
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border: 1px dashed #1e6dcf;
        }
        .tl, .tr, .bl, .br, .ro, .move{
            background-color: #1e6dcf;
            width: 15px;
            height: 15px;
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
            transform: translate(-50%, 0);
        }
        .move{
            bottom: -30px;
            left: 50%;
            transform: translate(-50%, 0);
        }
    }
    .orientBtn{
        position: absolute;
        z-index: 50;
        bottom: 30px;
        left: 50%;
        transform: translate(-50%, 0);
        display: flex;
        @media (max-width: 1024px) {
            bottom: 10px;
        }
        button{ 
            padding: 10px 20px;
            border-radius: 4px; 
            border: none;
            cursor: pointer;
            outline: none;
            color: #fff;
            background-color: #80bb30;
            @media (max-width: 1024px) {
                padding: 10px;
            }
            & + button{
                margin-left: 15px;
            }
            &>span{
                @media (max-width: 1024px) {
                    display: none;
                }
            }
            svg{
                display: none;
                width: 22px;
                @media (max-width: 1024px) {
                    display: block;
                }
                *{
                    fill:#fff;
                }
            }
            &:disabled{
                background-color: #fff;
                color: #979797;
                svg{
                    *{
                        fill:#74ae26;
                    }
                }
            }
        }
    }
    .contextMenu{
        position: absolute;
        z-index: 100;
        display: flex;
        flex-direction: column;
         button{ 
            padding: 10px 20px;
            background-color: #fff;
            border-radius: 4px; 
            border: none;
            cursor: pointer;
            outline: none;
            & + button{
                margin-top: 5px;
            }
            &:active{
                color: #fff;
                background-color: #80bb30;
            }
        }
    }
</style>