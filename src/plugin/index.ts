import { PluginAction, PluginCallbackFunction, PluginMessagePayload } from '../shared';

figma.showUI(__html__);

async function loadFonts() {
  await figma.loadFontAsync({
    family: 'Roboto',
    style: 'Regular',
  });
}

function isPayload(payload: unknown): payload is PluginMessagePayload {
  return (
    typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'type')
    // Object.prototype.hasOwnProperty.call(payload, 'randomQuote')
  );
}

function generateRandomQuote({ randomQuote }: PluginMessagePayload) {
  const currentSelectionNode = figma.currentPage.selection[0];
  if (currentSelectionNode?.type === 'TEXT') {
    currentSelectionNode.fontName = {
      family: 'Roboto',
      style: 'Regular',
    };
    currentSelectionNode.characters = `${randomQuote?.text} - ${randomQuote?.author || 'Unknown'}`;
  } else {
    throw new Error('No text node is selected');
  }
}

function replaceTargetTextNodes() {
  const nodes = figma.currentPage.findAllWithCriteria({
    types: ['TEXT'],
  });
  const targets = nodes.filter((node) => node.name.includes('숨고 페이'));

  targets.forEach((target: TextNode) => {
    const temp = target;
    temp.fontName = {
      family: 'Roboto',
      style: 'Regular',
    };
    temp.characters = temp.characters.replace('숨고 페이', '숨고페이');
  });
}

function setOpacity() {
  const currentSelection = figma.currentPage.selection;
  for (let i = 0; i <= currentSelection.length; i += 1) {
    const node = currentSelection[i];
    if (node?.type === 'FRAME') {
      node.opacity *= 0.5;
    }
  }
}

loadFonts().then(() => {
  figma.ui.onmessage = (payload: unknown) => {
    const callbackMap: Record<PluginAction, PluginCallbackFunction> = {
      generateRandomQuote,
      replaceTargetTextNodes,
      setOpacity,
    };

    if (isPayload(payload) && callbackMap[payload.type]) {
      callbackMap[payload.type](payload);
    }
  };
});
