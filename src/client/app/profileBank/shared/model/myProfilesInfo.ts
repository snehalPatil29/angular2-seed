import { MasterData, GrdOptions } from  '../../../shared/model/index';

export class AllCandidateProfiles {
  public GrdOperations = new GrdOptions();
  public Profiles: Array<CandidateProfile> = new Array<CandidateProfile>();
}

export class CandidateProfile {
  //public CandidateID: string;
  public CandidateID: MasterData = new MasterData();
  public Candidate: string;//Candidate prop holds Full name of candidate
  public CANDIDATECODE: string;
  public FirstName: string;
  public MiddleName: string;
  public LastName: string;
  public PrimaryContact: string;
  public Email: string;
  public Tag: string;
  public Skills: Array<string>;
  public ResumeID: number;
  public Status = new MasterData();
  public Comments: string;
  public CandidateOtherDetails = new OtherDetails();
  public CandidateSalaryDetails = new SalaryDetails();
  public CandidateSkills = new Skills();
  public AadharCardNo: string = '';
  public CandidateTeamManagement = new TeamManagement();
  public CandidateSocialInformation = new SocialInformation();
  public CandidateCareerProfile = new CareerProfile();
  public CandidateCurrentCompanyProfile = new EmploymentHistory();
  public CandidateMailDetails = new MailDetails();
  //for checkboxes for list
  public IsChecked: boolean;
  public url: any;
  public RRFID: MasterData = new MasterData();



  //Properties of Personal Information
  public SecondaryContact: number;
  public City: string;
  public District: string;
  public State = new MasterData();
  public Country = new MasterData();
  public PermanentAddress: string;
  public CurrentAddress: string;
  public PANNumber: string = '';
  public PassportNumber: string = '';
  public OutstationedCandidate: any;
  public ReadyToRelocate: any;
  public CommentsAdditionalInformation: string;
  public ResumeSource: string;
  public ReasonToRelocate: string;
  public FriendsRelatives: string;
  public IsCurrentSameAsPermanent: any;

  //properties of Qualification
  public CandidateQualification: Array<Qualification>;

  //Comments
  public FollowUpComments: string;
  public PreviousFollowupComments: string;
  public CommentsUpdated: boolean;

  //for Edit access
  public isAuthourized: boolean;
  public Owner: MasterData = new MasterData();
  public CandidateCode: string;
  //public isRRFAssigned: boolean;
  public RRFAssigned: RRFAssigned = new RRFAssigned();

  /**property for Images results binary string */
  public BinaryImage: string;
  /**Property for resume dowload which add to hold document in binary format */
  public BinaryResume: string;
  /**Property for giving file name with extection */
  public ResumeName: string = 'TestResume.doc';
  /**Propety to get profiles last updated date */
  public ModifiedOn: string;

}

export class Qualification {
  public CandidateID: MasterData = new MasterData();
  public QualificationID: number;
  public Qualification: MasterData = new MasterData();
  public YearofPassing: number;
  public Marks: number;
  public Grade: MasterData = new MasterData();
}

export class TeamManagement {
  //properties of Candidate Team Management
  public TeamMgmt: any;
  public CandidateID: MasterData = new MasterData();
  public TeamHandlingExperience: string;
  public NoofTeamMembers: number;
  public TeamMembersDesignations: string;
  public TeamHandlingChallenges: string;
  public CommentsUpdated: boolean;
  public FollowUpComments: string;
}
export class SocialInformation {
  public FacebookID:string;
  public TwitterID:string;
  public GooglePlusID:string;
  public LinkedinID:string;
  public CandidateID:MasterData;
}
export class MailDetails {
  //properties of candidate Mail Details
  public CC: string;
  public Subject: string;
  public Body: string;
  public Status: string;
  public To: string;
}
export class CareerProfile {
  //properties of Candidate Career Profile
  public TotalExperience: number;
  public CandidateID: MasterData = new MasterData();
  public RelevantExperience: number;
  public CurrentCompany: string;
  public CurrentDesignationRole: string;
  public TimeSpentInCurrentCompany: number;
  public CommentsUpdated: boolean;
  public FollowUpComments: string;
}

export class Skills {
  public CandidateID: MasterData = new MasterData();
  public ExpInSkill: string;
  public AnyFunctionalExp: string;
  public AnyFunctionalExpFlag: boolean;
  public PrimarySkills: string;
  public SecondarySkills: string;
  public OtherSkills: string;
  public RoleAndResponsibility: string;
  public ProjectsDone: string;
  public TestingSkills: string;
  public Database: string;
  public InclinationToOtherTechnology: string;
  public AwareAboutTesting: string;
  public StrongTechnicalSkills: string;
  public CommentsUpdated: boolean;
  public FollowUpComments: string;
}

export class SalaryDetails {
  public CandidateID: MasterData = new MasterData();
  public CurrentSalary: string = '';
  public ExpectedSalary: string = '';
  public TakeHomePay: number;
  public AnyPerks: string;
  public CTCIncludeVariable: any;
  public HowMuchVariable: number;
  public Allowance: boolean = false;
  public AllowanceInHand: number;
  public IncentiveInHand: number;
  public Incentive: boolean = false;
  public CommentsUpdated: boolean;
  public FollowUpComments: string;
}

export class OtherDetails {
  public CandidateID: MasterData = new MasterData();
  public AppliedEarlier: any;
  public AppraisalBondContractDetails: string;
  public BondContractDetails: string;
  public Visa: MasterData = new MasterData();
  public NoticePeriod: string = '';
  public RoleExpected: string;
  public ResignedStatusOfOfferedCandidate: string;
  public JobSerachPeriod: string;
  public FamilyBackground: string;
  public Strengths: string;
  public Weekness: string;
  public IfExstingCompanyOffers: string;
  public NoticePeriodNotCompletedCount: string;
  public LookingFor: string;
  public OfferInHand: any;
  public OfferDetails: string;
  public PrimaryReasonToQuitLastJob: string;
  public SecondaryReasonToQuitLastJob: string;
  public PrimaryReasonToQuitCurrentJob: string;
  public SecondaryReasonToQuitCurrentJob: string;
  public EarlierAppliedProcess: string;
  public OfferedCandidateStatus: string;
  public CommentsUpdated: boolean;
  public FollowUpComments: string;

}
export class ResumeMeta {
  public Profile: File;
  public CandidateID: MasterData = new MasterData();
  public Overwrite: boolean;
}

export class AddCandidateResponse {
  public StatusCode: number;
  public Message: '';
  public ReasonCode: string;
  public ErrorMsg: string;
  public CandidateID: MasterData = new MasterData();
}
export class TransferOwnershipMeta {
  public CandidateID: MasterData = new MasterData();
  public OwnerType = new MasterData();
  public CurrentOwner = new MasterData();
  public OwnershipComments: string;
  public CandidateName: string;
  public CandidateIds: Array<MasterData> = new Array<MasterData>();
  public Owner = new MasterData();
}

/**Employment history represents canidates existing and current employer information.*/
export class EmploymentHistory {
  public CandidateID: MasterData = new MasterData();
  public CareerProfileID: string;
  public DesignationRole: string;
  public Company: string;
  public Location: string;
  public TimeSpentInCompany: string;
  public IsCurrentCompany: boolean = false;
  public ToDate: string;
  public FromDate: string;
}
export class CandidateExperience {
  public CandidateID: MasterData = new MasterData();
  public TotalExperience: string;
  public RelevantExperience: string;
  public FollowUpComments: string;
  public CANDIDATECODE: string;
  public ItemID: string;
  public CommentsUpdated: boolean = false;
}
export class BarChartData {
  public functions: any[];
  public ratingsData: string[];
}
//TODO replace isRRFAssigned property from RRFAssigned object from all pages Model
export class RRFAssigned {
  public isRRFAssigned: boolean;
  public RRFID: MasterData = new MasterData();
}
// export class GridOperations {
//   public IDColl: Array<number> = new Array<number>();
//   public ButtonClicked: number;
//   public NextButton: boolean;
//   public PreviousButton: boolean;
//   public PerPageCount: number;
//   // public OrderBy: string;
//   // public OrderColumn: string;
// }
