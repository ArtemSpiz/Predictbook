import { TextNode, type SerializedTextNode, type LexicalNode, type EditorConfig } from 'lexical'

export type SerializedHighlightNode = SerializedTextNode & { type: 'highlight' }

export class HighlightNode extends TextNode {
  static getType(): string {
    return 'highlight'
  }
  static clone(node: HighlightNode): HighlightNode {
    return new HighlightNode(node.__text, node.__key)
  }

  createDOM(config: EditorConfig): HTMLElement {
    const el = super.createDOM(config)
    el.style.backgroundColor = 'yellow'
    el.style.padding = '0 2px'
    return el
  }

  static importJSON(json: SerializedHighlightNode): HighlightNode {
    return new HighlightNode(json.text)
  }

  exportJSON(): SerializedHighlightNode {
    return { ...super.exportJSON(), type: 'highlight', version: 1 }
  }
}

export function $createHighlightNode(text: string): HighlightNode {
  return new HighlightNode(text)
}

export function $isHighlightNode(node: LexicalNode | null | undefined): node is HighlightNode {
  return node instanceof HighlightNode
}
