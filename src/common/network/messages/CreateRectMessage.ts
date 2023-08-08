import { NetworkSide } from '@common/network/sides';
import * as Networker from 'monorepo-networker';

interface Payload {
  width: number;
  height: number;
}

export class CreateRectMessage extends Networker.MessageType<Payload> {
  public receivingSide(): Networker.Side {
    return NetworkSide.PLUGIN;
  }

  private async init() {
    console.log('font load');
    const nodes = figma.currentPage.findAllWithCriteria({
      types: ['TEXT'],
    });

    const rangeFontNames = [] as FontName[];

    nodes.forEach((node) => {
      // const rangeFontNames = [] as FontName[];
      for (let i = 0; i < node.characters.length; i++) {
        const fontName = node.getRangeFontName(i, i + 1) as FontName;
        console.log('fontName', fontName);
        if (
          rangeFontNames.some(
            (name) => name.family === fontName.family && name.style === fontName.style
          )
        )
          continue;
        rangeFontNames.push(node.getRangeFontName(i, i + 1) as FontName);
      }
    });

    await Promise.all(rangeFontNames.map((name) => figma.loadFontAsync(name)));
  }

  public handle(payload: Payload, from: Networker.Side): void {
    // if (figma.editorType === 'figma') {
    //   const rect = figma.createRectangle();
    //   rect.x = 0;
    //   rect.y = 0;
    //   rect.name = 'Plugin Rectangle # ' + Math.floor(Math.random() * 9999);
    //   rect.fills = [
    //     {
    //       type: 'SOLID',
    //       color: {
    //         r: Math.random(),
    //         g: Math.random(),
    //         b: Math.random(),
    //       },
    //     },
    //   ];
    //   rect.resize(payload.width, payload.height);
    //   figma.currentPage.appendChild(rect);
    //   figma.viewport.scrollAndZoomIntoView([rect]);
    //   figma.closePlugin();
    // }

    const nodes = figma.currentPage.findAllWithCriteria({
      types: ['TEXT'],
    });

    this.init().then(() => {
      nodes.forEach((node) => {
        // const rangeFontNames = [] as FontName[];
        for (let i = 0; i < node.characters.length; i++) {
          node.characters = node.characters.replace('숨고 페이', '숨고페이');
        }
      });
    });
  }
}
