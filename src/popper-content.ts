import {
  Component,
  Input,
  ElementRef,
  OnDestroy,
  ViewChild,
  EventEmitter,
  HostListener,
} from "@angular/core";
import Popper from 'popper.js';
import {Placement, Trigger, Triggers} from './popper.model';

@Component({
  selector: "popper-content",
  template: `
<div #popperViewRef class="popper"  
     [class.fade]="animationClass"
     [style.display]="displayType"
     role="popper">        
      <div class="popper__inner"><ng-content ></ng-content>  {{ content }} </div>
      <div class="popper__arrow"></div>  
    
</div>
`,
  styles: [`
.popper {
  display:none;
  position: absolute;    
  border-radius: 3px;
  border: 1px solid grey;
  box-shadow: 0 0 2px rgba(0,0,0,0.5);  
  padding: 10px;
}
.popper .popper__arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
}

.popper[x-placement^="top"],
.popper[x-placement^="bottom"],
.popper[x-placement^="right"],
.popper[x-placement^="left"]
{
  display:block;
}
.popper[x-placement^="top"] {
  margin-bottom: 5px;
}
.popper[x-placement^="top"] .popper__arrow {
  border-width: 5px 5px 0 5px;
  border-color: grey transparent transparent transparent;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}
.popper[x-placement^="bottom"] {
  margin-top: 5px;
}
.popper[x-placement^="bottom"] .popper__arrow {
  border-width: 0 5px 5px 5px;
  border-color: transparent transparent grey transparent;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}
.popper[x-placement^="right"] {
  margin-left: 5px;
}
.popper[x-placement^="right"] .popper__arrow {
  border-width: 5px 5px 5px 0;
  border-color: transparent grey transparent transparent;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}
.popper[x-placement^="left"] {
  margin-right: 5px;
}
.popper[x-placement^="left"] .popper__arrow {
  border-width: 5px 0 5px 5px;
  border-color: transparent transparent transparent grey;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}`]
})
export class PopperContent implements OnDestroy {

  @Input()
  content: string;

  @Input()
  placement: Placement;

  text: string;
  animationClass: string = '';

  @ViewChild("popperViewRef")
  popperViewRef: ElementRef;
  boundariesElement: string;
  referenceObject: HTMLElement;
  popperInstance: Popper;
  trigger: Trigger;
  popperModifiers: {};
  isMouseOver: boolean = false;
  onHidden = new EventEmitter();

  @HostListener('mouseover')
  onMouseOver() {
    this.isMouseOver = true;
  }

  @HostListener('mouseleave')
  showonleave() {
    this.isMouseOver = false;
    if (this.trigger !== Triggers.Hover) {
      return;
    }
    this.hide();
  }

  displayType: string = "none";

  constructor() {
  }

  ngOnDestroy() {
    if(!this.popperInstance){
      return;
    }
    (this.popperInstance as any).disableEventListeners();
    this.popperInstance.destroy();

  }

  show(): void {
    if (!this.referenceObject) {
      return;
    }

    let popperOptions: Popper.PopperOptions = <Popper.PopperOptions>{
      placement: this.placement,
      modifiers: {
        arrow: {
          element: this.popperViewRef.nativeElement.querySelector('.popper__arrow')
        }
      }
    };

    if (this.boundariesElement) {
      popperOptions.modifiers.preventOverflow = {
        boundariesElement: document.querySelector(this.boundariesElement),
      };
    }

    popperOptions.modifiers = Object.assign(popperOptions.modifiers, this.popperModifiers);

    this.popperInstance = new Popper(
      this.referenceObject,
      this.popperViewRef.nativeElement,
      popperOptions,
    );
    (this.popperInstance as any).enableEventListeners();
    this.displayType = "block";
  }

  update(): void {
    this.popperInstance && (this.popperInstance as any).update();
  }

  scheduleUpdate(): void {
    this.popperInstance && (this.popperInstance as any).scheduleUpdate();
  }

  hide(): void {
    this.displayType = "none";
    this.onHidden.emit();
  }

}