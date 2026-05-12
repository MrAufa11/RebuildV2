// Load all models from the main models index
const mainModels = require('../../../../models');

// Export specific models for SPMB app
const models = {
    // SPMB specific models
    Registrant: mainModels.Registrant,
    Student: mainModels.Student,
    StudentUser: mainModels.StudentUser,
    Voucher: mainModels.Voucher,
    Format: mainModels.Format,
    SchoolData: mainModels.SchoolData,

    // Reference data models
    ExamNumber: mainModels.ExamNumber,
    SelectionSchedule: mainModels.SelectionSchedule,
    SelectionType: mainModels.SelectionType,
    ScheduleDetail: mainModels.ScheduleDetail,
    Discount: mainModels.Discount,
    Position: mainModels.Position,
    Classroom: mainModels.Classroom,
    BuildingSetup: mainModels.BuildingSetup,
    RoomSetup: mainModels.RoomSetup,
    DiscountSetup: mainModels.DiscountSetup,
    AcademicYearSetup: mainModels.AcademicYearSetup,
    LifeStatus: mainModels.LifeStatus,
    RequirementMaster: mainModels.RequirementMaster,
    EducationLevel: mainModels.EducationLevel,
    Occupation: mainModels.Occupation,
    Income: mainModels.Income,
    Religion: mainModels.Religion,
    Bank: mainModels.Bank,
    RegistrationBatch: mainModels.RegistrationBatch,
    RegistrationPath: mainModels.RegistrationPath,
    RegistrationSubPath: mainModels.RegistrationSubPath,
    RegistrantDocument: mainModels.RegistrantDocument,

    // Also include shared models if needed
    User: mainModels.User,
    Role: mainModels.Role,

    // Export Sequelize and Op for convenience
    Sequelize: mainModels.Sequelize,
    Op: mainModels.Op,
    
    // Export databases for direct model initialization
    databases: mainModels.databases
};

module.exports = models;
