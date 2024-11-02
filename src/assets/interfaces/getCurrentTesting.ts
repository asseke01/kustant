export interface Subject {
  name: string;
  name_display: string;
  questions_count: number;
}

export interface GetCurrentTesting {
  test_id: number;
  ends_at: string;
  subjects: Subject[];
  subjects_answers: { [key: string]: number[] };
}
