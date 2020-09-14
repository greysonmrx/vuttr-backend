interface IFindToolsDTO {
  user_id: string;
  tag?: string;
  title?: string;
  skip: number;
  take: number;
}

export default IFindToolsDTO;
