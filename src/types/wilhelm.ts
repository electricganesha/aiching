export interface WilhelmLine {
  text: string;
  comments: string;
}

export interface WilhelmSection {
  chinese: string;
  symbolic: string;
  alchemical: string;
}

export interface WilhelmHexagram {
  hex: number;
  hex_font: string;
  trad_chinese: string;
  pinyin: string;
  english: string;
  binary: string | number;
  od: string | number;
  wilhelm_above: WilhelmSection;
  wilhelm_below: WilhelmSection;
  wilhelm_symbolic: string;
  wilhelm_judgment: {
    text: string;
    comments: string;
  };
  wilhelm_image: {
    text: string;
    comments: string;
  };
  wilhelm_lines: {
    [key: number]: WilhelmLine;
  };
}

export interface IChingWilhelmTranslation {
  [key: number]: WilhelmHexagram;
}
