export interface GetSpecifiedTestResults {
  testings: Testings[]
}

export interface Testings {
  learner_fullname: string;
  started_on: string;
  completed_on: string;
  taken_marks: number;
  over_all_marks: number;
  id: number;
}
