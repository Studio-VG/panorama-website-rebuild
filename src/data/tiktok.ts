import { TikTokVideoItem } from '../types';
import { publicAsset } from '../lib/publicAsset';

export const TIKTOK_VIDEOS: TikTokVideoItem[] = [
  {
    id: 1,
    thumbnail: publicAsset('/tiktok/video-1.jpg'),
    url: 'https://www.tiktok.com/@panorama_glass/video/7614863385661803797',
    title: {
      ka: 'გილიოტინის სისტემა',
      en: 'Guillotine Glass System',
      ru: 'Гильотинная система остекления',
    },
  },
  {
    id: 2,
    thumbnail: publicAsset('/tiktok/video-2.jpg'),
    url: 'https://www.tiktok.com/@panorama_glass/video/7661964183474326804',
    title: {
      ka: 'შემინული ოფისი',
      en: 'Glazed Office Partitions',
      ru: 'Остекленный офис',
    },
  },
  {
    id: 3,
    thumbnail: publicAsset('/tiktok/video-3.jpg'),
    url: 'https://www.tiktok.com/@panorama_glass/video/7520131410779278610',
    title: {
      ka: 'პანორამული ვიტრაჟი',
      en: 'Panoramic Glazing',
      ru: 'Панорамный витраж',
    },
  },
];
