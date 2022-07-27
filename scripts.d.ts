declare module MPatientInfo {

    export interface Main{
        PatientID: string,
        EncounterID : string,
        ParctitionerID : string,
        MI1ClientID : string

    }

}

declare var PatientInfo:MPatientInfo.Main ;