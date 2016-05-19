
export class Panel {
    public RoundNumber: number;
    public Interviewers: string[];
    public Status: string;
    public Comments: string;
}

export class RRFDetails {
    public RRFID: number;
    public Practice: string;
    public Technology: string;
    public PositionTitle: string;
    public Description: string;
    public NoOfOpenings: number;
    public SkillsRequired: string;
    public Designation: string;
    public MinExp: number;
    public MaxExp: number;
    public Priority: number;
    public ExpDateOfJoining: string;
    public RaisedBy: string;
    public Status: string;
    public Panel: Panel[] = [];

    public IsChecked: boolean;
    public Comment: string;
}

export class MasterData {
    public Id: number;
    public Value: number;
}

export class AllRRFStatusCount {
    public PendingApproval: number;
    public Rejected: number;
    public Open: number;
    public Assigned: number;
    public InProgress: number;
    public ClosureApproval: number;
    public Closed: number;
    public OnHold: number;
}
