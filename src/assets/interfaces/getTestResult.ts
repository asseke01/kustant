export interface GetTestResult {
  started_on: string;
  over_all_marks: number;
  taken_marks: number;
  subjects: any;
  test_type_display: string;
  test_name: string | null;
  subject_display: string;
  subject: string;
}
