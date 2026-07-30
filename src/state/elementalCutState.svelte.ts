import type { ThothCard } from '../types';
import { type FourPilesCut, cutDeckWithCustomRatios } from '../utils/thothSpread';
import { triggerHaptic } from '../utils/hapticFeedback';

export class ElementalCutMinigameState {
  cutStage = $state<1 | 2 | 3 | 'done'>(1);
  markerPos = $state<number>(50);
  isCutMoving = $state<boolean>(true);
  isSlicingAnimation = $state<boolean>(false);

  ratio1 = $state<number>(0.5);
  ratio2 = $state<number>(0.5);
  ratio3 = $state<number>(0.5);

  private speed = 1.4;
  private dir = 1;
  private animId: number | null = null;
  private lastTime = 0;

  startLoop() {
    this.stopLoop();
    if (!this.isCutMoving || this.cutStage === 'done') return;

    this.lastTime = performance.now();
    const updateLoop = (now: number) => {
      const delta = (now - this.lastTime) / 16.66;
      this.lastTime = now;

      let next = this.markerPos + this.dir * this.speed * delta;
      if (next >= 100) {
        next = 100;
        this.dir = -1;
      } else if (next <= 0) {
        next = 0;
        this.dir = 1;
      }
      this.markerPos = next;

      if (this.isCutMoving && this.cutStage !== 'done') {
        this.animId = requestAnimationFrame(updateLoop);
      }
    };

    this.animId = requestAnimationFrame(updateLoop);
  }

  stopLoop() {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  handleExecuteCut(deck: ThothCard[], onCustomCutPiles?: (result: FourPilesCut) => void) {
    if (!this.isCutMoving || this.cutStage === 'done') return;

    triggerHaptic([30, 50, 30]);
    this.isCutMoving = false;
    this.isSlicingAnimation = true;
    this.stopLoop();

    const currentRatio = 0.3 + (this.markerPos / 100) * 0.4;

    setTimeout(() => {
      this.isSlicingAnimation = false;

      if (this.cutStage === 1) {
        this.ratio1 = currentRatio;
        this.cutStage = 2;
        this.markerPos = 50;
        this.isCutMoving = true;
        this.startLoop();
      } else if (this.cutStage === 2) {
        this.ratio2 = currentRatio;
        this.cutStage = 3;
        this.markerPos = 50;
        this.isCutMoving = true;
        this.startLoop();
      } else if (this.cutStage === 3) {
        this.ratio3 = currentRatio;
        const finalResult = cutDeckWithCustomRatios(deck, this.ratio1, this.ratio2, currentRatio);
        if (onCustomCutPiles) {
          onCustomCutPiles(finalResult);
        }
        this.cutStage = 'done';
      }
    }, 600);
  }

  handleRestartMinigame() {
    this.stopLoop();
    this.cutStage = 1;
    this.markerPos = 50;
    this.isCutMoving = true;
    this.isSlicingAnimation = false;
    this.ratio1 = 0.5;
    this.ratio2 = 0.5;
    this.ratio3 = 0.5;
    this.speed = 1.4;
    this.dir = 1;
    this.startLoop();
  }
}
