/**
 * size config for image:
 * huge [HD] 1:1 (1440x1440), 4:5 (1152x1440), 16:9 (1440x810);
 * large [LARGE] 1:1 (360x360), 4:5 (360x450), 16:9 (360x202);
 * medium [MEDIUM] (192x192);
 * small [SMALL] (160x90);
 * thumbnail [THUMBNAIL] (45x45)
 */
export const ImageSizeConfig = {
  HUGE_HD1_1: {
    key: '1:1',
    defaultWidth: 1440,
    defaultHeight: 1440,
  },
  HUGE_HD4_5: {
    key: '4:5',
    defaultWidth: 1152,
    defaultHeight: 1440,
  },
  HUGE_HD16_9: {
    key: '16:9',
    defaultWidth: 1440,
    defaultHeight: 810,
  },
  LARGE1_1: {
    key: '1:1',
    defaultWidth: 360,
    defaultHeight: 360,
  },
  LARGE16_9: {
    key: '16:9',
    defaultWidth: 360,
    defaultHeight: 202,
  },
  LARGE4_5: {
    key: '4:5',
    defaultWidth: 360,
    defaultHeight: 450,
  },
  MEDIUM: {
    key: null,
    defaultWidth: 192,
    defaultHeight: 192,
  },
  SMALL: {
    key: null,
    defaultWidth: 160,
    defaultHeight: 90,
  },
  THUMBNAIL: {
    key: null,
    defaultWidth: 45,
    defaultHeight: 45,
  },
};
