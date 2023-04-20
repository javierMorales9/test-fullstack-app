export interface AudienceOperatorAttr {
  field: string;
  operator: string;
  value: string | number;
}

export interface AudienceAttr {
  name: string;
  segments: AudienceOperatorAttr[];
}
