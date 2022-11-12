// see TDataForQuality
export default `
{
  actor: string;
  doc_coverage: number;
  test_coverage: number;
  dryness: number;
  modularity: number;
  issues?: {
    blocker: number;
    critical: number;
    info: number;
    major: number;
    minor: number;
  };
  issues_density: number;
}
`;
