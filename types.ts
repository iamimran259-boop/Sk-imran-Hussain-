
export enum PaperType {
  BLANK = 'blank',
  RULED = 'ruled',
  GRID = 'grid',
  CREAM = 'cream'
}

export interface FontConfig {
  id: string;
  name: string;
  family: string;
}

export interface DrawingElement {
  id: string;
  svgPath: string;
  viewBox: string;
  top: number; // percentage 0-100
  left: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface TextElement {
  id: string;
  text: string;
  top: number;
  left: number;
  width: number;
}

export interface LayoutContent {
  textElements: TextElement[];
  drawings: DrawingElement[];
  isLayoutMode: boolean;
}

export interface AppState {
  text: string;
  fontFamily: string;
  fontSize: number;
  inkColor: string;
  paperType: PaperType;
  lineHeight: number;
  letterSpacing: number;
  layout: LayoutContent;
  fullPage: boolean;
}
