import { longestCommonSubstring } from 'string-algorithms';
import onScan from 'onscan.js';
import HealthIdCard from './dl.jpeg';
import AamvsIdCard from './dl.jpeg';

export { onScan };

interface ScanrayOptions {
  blockKeyboardEventsDuringScan?: boolean;
  blockAltKeyEvents?: boolean;
  blockBadKeyboardShortcutEvents?: boolean;
  enabledLogging?: boolean;
  prefixKeyCodes?: number[];
  suffixKeyCodes?: number[];
}

export default class Scanray {
  static options: ScanrayOptions;
  static currentPrefix: string;
  static altKeySequence: string;

  static activateMonitor(options: ScanrayOptions): void {
    Scanray.options = options || {};

    if (options?.blockKeyboardEventsDuringScan) document.addEventListener('keydown', Scanray._trapKeyboardEventsDuringScan);
    if (options?.blockAltKeyEvents) document.addEventListener('keydown', Scanray._trapAltKeyListener);
    if (options?.blockBadKeyboardShortcutEvents) document.addEventListener('keydown', Scanray._trapCtrlKeyListener);

    onScan.attachTo(document, {
      prefixKeyCodes: options?.prefixKeyCodes || [171], // «
      suffixKeyCodes: options?.suffixKeyCodes || [187], // »
      onScan: Scanray.onScan,
      onScanError: Scanray._resetStateAfterScan,
      keyCodeMapper: Scanray.keyCodeMapper,
    });

    Scanray._resetStateAfterScan();
  }

  static deactivateMonitor(): void {
    Scanray._resetStateAfterScan();
    document.removeEventListener('keydown', Scanray._trapKeyboardEventsDuringScan);
    document.removeEventListener('keydown', Scanray._trapCtrlKeyListener);
    onScan.detachFrom(document);
  }

  static onScan(scanData: string): void {
    const options = Scanray.options;
    if (options.enabledLogging) console.log(`scanned: [${scanData}]`);

    let fixedScanData = scanData.replaceAll('[LF]', '\x0A').replaceAll('[CR]', '\x0D').replaceAll('[RS]', '\x1E');

    if (fixedScanData?.[0] === '%') {
      let hc = new HealthIdCard(fixedScanData);
      Scanray._emitHealthIdScanEvent(hc);
    }
    if (fixedScanData?.[0] === '@') {
      let dl = new AamvsIdCard(fixedScanData);
      Scanray._emitAamvaIdScanEvent(dl);
    }

    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLInputElement) {
      if (activeElement.value.includes(Scanray.currentPrefix))
        activeElement.value = activeElement.value.replaceAll(Scanray.currentPrefix, '');
      const minLen = 10;
      const formValue = activeElement.value.trim();
      const scanValue = `${Scanray.currentPrefix}${scanData}`.trim();
      if (options.enabledLogging) console.log(`activeElement.value: [${formValue}]`);
      if (scanValue.length === 0 || formValue.length === 0) return;
      longestCommonSubstring([formValue, scanValue]).forEach((overlappingStringToRemove: string) => {
        if (overlappingStringToRemove.length > minLen && formValue.includes(overlappingStringToRemove))
          activeElement.value = formValue.replace(overlappingStringToRemove, '');
      });
    }

    Scanray._resetStateAfterScan();
  }

  static keyCodeMapper(e: KeyboardEvent): string {
    const options = Scanray.options;
    if (onScan.isScanInProgressFor(document)) {
      if (options.enabledLogging)
        console.log(
          `Pressed: [${e.key}] => [` +
          `${e.ctrlKey ? 'Ctrl' : ''}` +
          `${e.shiftKey ? 'Shift' : ''}` +
          `${e.altKey ? 'Alt' : ''}` +
          `${e.key.charCodeAt(0)} (${e.code})]`
        );

      let altKey = '';
      if (e.altKey && e.code.startsWith('Numpad')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        Scanray.altKeySequence += e.key;
        if (Scanray.altKeySequence.length === 4) {
          const code = parseInt(Scanray.altKeySequence);
          if (!isNaN(code)) {
            altKey = String.fromCharCode(code);
            Scanray.altKeySequence = '';
          }
        }
      } else {
        Scanray.altKeySequence = '';
      }

      if (Scanray.accumulatedScanData().length === 0 && Scanray.isPrefix(altKey || e.key)) {
        Scanray.currentPrefix = altKey || e.key;
        return '';
      }
      if (e.altKey && e.code.startsWith('Numpad')) return '';

      if (e.ctrlKey && e.code === 'KeyJ') return '[LF]';
      if (e.ctrlKey && e.code === 'KeyM') return '[CR]';
      if (e.ctrlKey && e.shiftKey && e.code === 'Digit6') return '[RS]';

      const printable = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
      if (printable.includes(e.key)) return e.key;
    }
    return onScan.decodeKeyEvent(e);
  }

  static _resetStateAfterScan(): void {
    Scanray.currentPrefix = ' ';
    Scanray.altKeySequence = '';
  }

  static accumulatedScanData(): string {
    return (document as any).scannerDetectionData?.vars?.accumulatedString?.[0] || '';
  }

  static prefixesExpected(): number[] {
    return (document as any)?.scannerDetectionData?.options?.prefixKeyCodes || [];
  }

  static isPrefix(char: string): boolean {
    return Scanray.prefixesExpected().includes((char || ' ').charCodeAt(0));
  }

  static currentScanHasPrefix(): boolean {
    const firstChar = (Scanray.accumulatedScanData() || ' ')[0];
    return Scanray.isPrefix(firstChar) || Scanray.isPrefix(Scanray.currentPrefix);
  }

  static canBlockKeyboardEvents(): boolean {
    return onScan.isScanInProgressFor(document) && Scanray.currentScanHasPrefix();
  }

  static _trapKeyboardEventsDuringScan(e: KeyboardEvent): void {
    if (Scanray.canBlockKeyboardEvents()) e.preventDefault();
  }

  static _trapAltKeyListener(e: KeyboardEvent): void {
    if (e.altKey && e.code.startsWith('Numpad')) e.preventDefault();
  }

  static _trapCtrlKeyListener(e: KeyboardEvent): void {
    if (e.ctrlKey && !['KeyC', 'KeyX', 'KeyV', 'KeyP', 'KeyF', 'KeyR', 'KeyI', 'KeyA'].includes(e.code)) {
      e.preventDefault();
      if (Scanray.options.enabledLogging)
        console.log(`Blocked control sequence: [${JSON.stringify({ code: e.code, ctrlKey: e.ctrlKey, key: e.key })}]`);
    }
  }

  static _emitAamvaIdScanEvent(detail: any): void {
    const idScanEvent = new CustomEvent<any>('aamvaIdScan', { detail: detail });
    document.dispatchEvent(idScanEvent);
  }

  static _emitHealthIdScanEvent(detail: any): void {
    const idScanEvent = new CustomEvent<any>('healthIdScan', { detail: detail });
    document.dispatchEvent(idScanEvent);
  }
}
