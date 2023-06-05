/**
 * @description Image size config ['THUMBNAIL', 'SMALL', 'MEDIUM', 'LARGE1_1', 'LARGE4_5', 'LARGE16_9', 'HUGE_HD1_1', 'HUGE_HD4_5', 'HUGE_HD16_9']
 */
export const ImageSizeConfig = {
  /**
   * @description default size [ width: 1440, height: 1440, key: '1:1' ]
   */
  HUGE_HD1_1: {
    key: '1:1',
    defaultWidth: 1440,
    defaultHeight: 1440,
  },
  /**
   * @description default size [ width: 1152, height: 1440, key: '4:5' ]
   */
  HUGE_HD4_5: {
    key: '4:5',
    defaultWidth: 1152,
    defaultHeight: 1440,
  },
  /**
   * @description default size [ width: 1440, height: 810, key: '16:9' ]
   */
  HUGE_HD16_9: {
    key: '16:9',
    defaultWidth: 1440,
    defaultHeight: 810,
  },
  /**
   * @description default size [ width: 360, height: 360, key: '1:1' ]
   */
  LARGE1_1: {
    key: '1:1',
    defaultWidth: 360,
    defaultHeight: 360,
  },
  /**
   * @description default size [ width: 360, height: 202, key: '16:9' ]
   */
  LARGE16_9: {
    key: '16:9',
    defaultWidth: 360,
    defaultHeight: 202,
  },
  /**
   * @description default size [ width: 360, height: 450, key: '4:5' ]
   */
  LARGE4_5: {
    key: '4:5',
    defaultWidth: 360,
    defaultHeight: 450,
  },
  /**
   * @description default size [ width: 192, height: 192 ]
   */
  MEDIUM: {
    key: null,
    defaultWidth: 192,
    defaultHeight: 192,
  },
  /**
   * @description default size [ width: 160, height: 90 ]
   */
  SMALL: {
    key: null,
    defaultWidth: 160,
    defaultHeight: 90,
  },
  /**
   * @description default size [ width: 45, height: 45 ]
   */
  THUMBNAIL: {
    key: null,
    defaultWidth: 45,
    defaultHeight: 45,
  },
};
