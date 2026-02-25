
export type AgeRange = 'under 18' | '18–24' | '25–34' | '35+';

export type RelationshipStatus = 'Single' | 'In a relationship' | 'Situationship' | 'Married' | 'Divorced/Separated' | 'Widowed';

export type SupportType = 'anxiety' | 'depression' | 'relationships' | 'loneliness' | 'something else';

export type CommunicationPreference = 'text' | 'voice' | 'journal';

export interface UserProfile {
  name: string;
  identity: string;
  ageRange: AgeRange;
  relationshipStatus: RelationshipStatus;
  supportType: SupportType;
  communicationPreference: CommunicationPreference;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}
