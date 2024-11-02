export interface answers {
  id: number;
  text: string;
  is_selected?: boolean;
}

export interface questions {
  id: number;
  text: string;
  answer_id: number;
}

export interface GetQuestion {
  id: number;
  question_type: string;
  question_id: number;
  text: string;
  type: string;
  questions?: questions[];
  answers: answers[];
}
