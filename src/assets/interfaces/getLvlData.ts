export interface lvlData {
  name: string;
  id: number;
}

export interface GetLvlData {
  lvl_data: lvlData[];
  poster: string;
  title: string;
  sub_title: string;
  header: string;
  sub_header: string;
  is_last_lvl: boolean;
}
