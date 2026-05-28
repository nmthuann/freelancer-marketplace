export class SearchUsersDto {
  q?: string; // tìm theo username / fullName
  skills?: string[]; // lọc theo skill
  level?: string; // lọc theo level (NEW_SELLER, LEVEL_1, ...)
  page?: number;
  limit?: number;
}
