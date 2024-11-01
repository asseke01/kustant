export interface GetLearnerSpecifiedTests {
  id: number;
  name: string;
  starts_at: string;
  ends_at: string;
  group_name: string;
  is_available: boolean;
  test_type: string;
  test_type_display: string;
  subject_display: string | null;
  subject: string | null;
}
