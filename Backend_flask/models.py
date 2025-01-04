#here we have the model (databse structur)


from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import ARRAY
db = SQLAlchemy()

# For user table
class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(700), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='TestLead')

    def to_dict(self):
        return {
            'user_id': self.id,
            'username': self.username,
            'password': self.password,
            'role': self.role
        }

# For project name table
class Project_name(db.Model):
    __tablename__ = 'project_name'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    project_name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="Project_name")


    #for relactionship for edlete the project 
    

    def to_dict(self):
        return {
            'id': self.id,
            'project_name': self.project_name,
            "user_id": self.user_id
        }

# For project details table
class Project_details(db.Model):
    __tablename__ = 'project_details'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    RAG = db.Column(db.String(100), nullable=False)
    tester_count = db.Column(db.Integer, nullable=False)
    billable = db.Column(ARRAY(db.Integer), nullable=False)
    nonbillable = db.Column(ARRAY(db.Integer), nullable=False)
    # billable = db.Column(db.JSON, nullable=True)
    # nonbillable = db.Column(db.JSON, nullable=True)
    billing_type = db.Column(db.String(100), nullable=False)
    automation = db.Column(db.String(100), nullable=False, default="Nil")
    ai_used = db.Column(db.String(100), nullable=False, default="Nil")
    RAG_details = db.Column(db.String(100), nullable=False,default="Nil")
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Relationship
    project_name = db.relationship("Project_name", backref="project_details")
    user = db.relationship("Users", backref="project_details")

    def to_dict(self):
        return {
            'id': self.id,
            'project_name_id': self.project_name_id,
            'RAG': self.RAG,
            'tester_count': self.tester_count,
            'billable': self.billable,
            'nonbillable': self.nonbillable,
            'billing_type': self.billing_type,
            'automation': self.automation,
            'ai_used': self.ai_used,
            'RAG_details': self.RAG_details,
            "user_id": self.user_id
        }
## old code for tester_details
# # For testers table
# class Testers(db.Model):
#     __tablename__ = 'testers'
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     tester_name = db.Column(db.String(100), nullable=False, unique=False)
#     billable = db.Column(db.Boolean, nullable=True, default=False)
#     project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=True)
#     # project_name_id = db.Column(ARRAY(db.Integer, db.ForeignKey("project_name.id")), nullable=False)
#     user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    
#     user = db.relationship("Users", backref="testers")
#     # Relationship with Project_name
#     project_name = db.relationship("Project_name", backref="testers")

        
#     def to_dict(self):
#         return {
#             'id': self.id,
#             'tester_name': self.tester_name,
#             'billable': self.billable,
#             'project_name_id': self.project_name_id,
#             "user_id": self.user_id
#         }
    

#new code for tester name
# For testers table
class Testers(db.Model):
    __tablename__ = 'testers'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # tester_name = db.Column(db.String(100), nullable=False, unique=False)
    billable = db.Column(db.Boolean, nullable=True, default=False)
    tester_name_id = db.Column(db.Integer, db.ForeignKey("Tester_name.id"), nullable=False)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="testers")


    # Relationship with Project_name
    project_name = db.relationship("Project_name", backref="testers")
    tester_name = db.relationship("Tester_name", backref="testers")

        
    def to_dict(self):
        return {
            'id': self.id,
            'tester_name': self.tester_name.tester_name,
            'billable': self.billable,
            'project_name_id': self.project_name_id,
            "user_id": self.user_id
        }
    

#new testername

class Tester_name(db.Model):
    __tablename__ = 'Tester_name'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tester_name = db.Column(db.String(100), nullable=False, unique=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    user = db.relationship("Users", backref="Tester_name")
      
    def to_dict(self):
        return {
            'id': self.id,
            'tester_name': self.tester_name,
            "user_id": self.user_id
        }
    
# For new defects table
class New_defects(db.Model):
    __tablename__ = 'new_defects'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.Date, nullable=False)
    month = db.Column(db.String(100), nullable=False)
    regression_defect = db.Column(db.Integer, nullable=False)
    functional_defect = db.Column(db.Integer, nullable=False)
    defect_reopened = db.Column(db.Integer, nullable=False)
    uat_defect = db.Column(db.Integer, nullable=False)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="New_defects")

    # Relationship
    project_name = db.relationship("Project_name", backref="new_defects")

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date,
            'month': self.month,
            'regression_defect': self.regression_defect,
            'functional_defect': self.functional_defect,
            'defect_reopened': self.defect_reopened,
            'uat_defect': self.uat_defect,
            'project_name_id': self.project_name_id,
            "user_id": self.user_id
        }

# For test execution status table
class Test_execution_status(db.Model):
    __tablename__ = 'test_execution_status'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    month = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    total_execution = db.Column(db.Integer, nullable=False)
    tc_execution = db.Column(db.Integer, nullable=False)
    pass_count = db.Column(db.Integer, nullable=False)
    fail_count = db.Column(db.Integer, nullable=False)
    no_run = db.Column(db.Integer, nullable=False)
    blocked = db.Column(db.Integer, nullable=False)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="Test_execution_status")

    # Relationship
    project_name = db.relationship("Project_name", backref="test_execution_status")

    def to_dict(self):
        return {
            'id': self.id,
            'month': self.month,
            'pass_count': self.pass_count,
            'fail_count': self.fail_count,
            'no_run': self.no_run,
            'blocked': self.blocked,
            'project_name_id': self.project_name_id,
            'date': self.date,
            'total_execution': self.total_execution,
            'tc_execution': self.tc_execution,
            "user_id": self.user_id
        }

# For total defect status table
class Total_Defect_Status(db.Model):
    __tablename__ = 'total_defect_status'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    month = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    total_defect = db.Column(db.Integer, nullable=False)
    defect_closed = db.Column(db.Integer, nullable=False)
    open_defect = db.Column(db.Integer, nullable=False)
    critical = db.Column(db.Integer, nullable=False)
    high = db.Column(db.Integer, nullable=False)
    medium = db.Column(db.Integer, nullable=False)
    low = db.Column(db.Integer, nullable=False)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="Total_Defect_Status")

    # Relationship
    project_name = db.relationship("Project_name", backref="total_defect_status")

    def to_dict(self):
        return {
            'id': self.id,
            'month': self.month,
            'date': self.date,
            'total_defect': self.total_defect,
            'defect_closed': self.defect_closed,
            'open_defect': self.open_defect,
            'critical': self.critical,
            'high': self.high,
            'medium': self.medium,
            'low': self.low,
            'project_name_id': self.project_name_id,
            "user_id": self.user_id
        }

# Build status table
class BuildStatus(db.Model):
    __tablename__ = 'build_status'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    month = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    total_build_received = db.Column(db.Integer, nullable=False)
    builds_accepted = db.Column(db.Integer, nullable=False)
    builds_rejected = db.Column(db.Integer, nullable=False)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="BuildStatus")


    # Relationship with the Project_name table
    project = db.relationship('Project_name', backref='build_status')

    def to_dict(self):
        return {
            'id': self.id,
            'month': self.month,
            'date': self.date,
            'total_build_received': self.total_build_received,
            'builds_accepted': self.builds_accepted,
            'builds_rejected': self.builds_rejected,
            'project_name_id': self.project_name_id,
            "user_id": self.user_id
        }

# Defect accepted vs rejected table
class DefectAcceptedRejected(db.Model):
    __tablename__ = 'defect_accepted_rejected'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    month = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    total_defects = db.Column(db.Integer, nullable=False)
    dev_team_accepted = db.Column(db.Integer, nullable=False)
    dev_team_rejected = db.Column(db.Integer, nullable=False)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="DefectAcceptedRejected")

    # Relationship with the Project_name table
    project = db.relationship('Project_name', backref='defect_accepted_rejected')

    def to_dict(self):
        return {
            'id': self.id,
            'month': self.month,
            'date': self.date,
            'total_defects': self.total_defects,
            'dev_team_accepted': self.dev_team_accepted,
            'dev_team_rejected': self.dev_team_rejected,
            'project_name_id': self.project_name_id,
            "user_id": self.user_id
        }

# Test case creation status table
class TestCaseCreationStatus(db.Model):
    __tablename__ = 'test_case_creation_status'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    month = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    total_test_case_created = db.Column(db.Integer, nullable=False)
    test_case_approved = db.Column(db.Integer, nullable=False)
    test_case_rejected = db.Column(db.Integer, nullable=False)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="TestCaseCreationStatus")

    # Relationship with the Project_name table
    project = db.relationship('Project_name', backref='test_case_creation_status')

    def to_dict(self):
        return {
            'id': self.id,
            'month': self.month,
            'date': self.date,
            'total_test_case_created': self.total_test_case_created,
            'test_case_approved': self.test_case_approved,
            'test_case_rejected': self.test_case_rejected,
            'project_name_id': self.project_name_id,
            "user_id": self.user_id
        }
