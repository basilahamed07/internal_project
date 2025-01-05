from flask import Flask, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, date
from models import db, New_defects, Test_execution_status, Total_Defect_Status, BuildStatus, DefectAcceptedRejected, TestCaseCreationStatus, Project_name
import pandas as pd

def total_defect_api(app):
    @app.route('/upload_data', methods=['POST'])
    @jwt_required()
    def upload_data():
        try:
            # Get the user ID from the JWT token
            user_id = get_jwt_identity()
            if not user_id:
                return jsonify({"error": "Unauthorized access"}), 401

            # Get the uploaded file from the request
            file = request.files.get('file')
            # print("DFGHJKLJHGFDS : ", file)
            if not file:
                return jsonify({"error": "No file uploaded"}), 400

            # Read the Excel file using pandas
            excel_data = pd.read_excel(file, sheet_name=None)  # sheet_name=None to read all sheets
            # print("DFGHJKLJHGFDSDFGHJKJHGFDFGHJKL : ", excel_data)
            # print(excel_data)

            # print(type(excel_data["Manage Defects"]))

            # name_of_interest = 'regression_defect'  # Adjust this for the row you're interested in
            # value = df.loc[df['name'] == name_of_interest, 'Value'].values
            


            df1 = excel_data["Manage Defects"]
            df2 = excel_data["Test Execution Status"]
            df3 = excel_data["Total Defect Status"]
            df4 = excel_data["Build Status"]
            df5 = excel_data["Defect AcceptedRejected"]
            df6 = excel_data["Test Case Creation Status"]

            # final_merge =// pd.concat([df1, df2, df3,df4,df5,df6], ignore_index=True)
            # print(final_merge)
   
            
            dataframe_collection = [df1, df2, df3, df4, df5, df6]
            dataframe_names = ["Manage Defects", "Test Execution Status", "Total Defect Status", "Build Status", "Defect AcceptedRejected", "Test Case Creation Status"]

            for df, name in zip(dataframe_collection, dataframe_names):
                if df.isnull().values.any():
                    return jsonify(f"Your provided data in '{name}' contains NaN values.")
                else:
                    continue

            # print(excel_data)
            print()
            print()
            print()

            # Prepare the data for each sheet
            sheet_data = {sheet_name: sheet_df.to_dict(orient='records') for sheet_name, sheet_df in excel_data.items()}
            print(type(sheet_data))
            print()
            print()
            
            print((sheet_data["Build Status"]))
            colums = [trash for trash in sheet_data.values()]

            # print(type(colums[""]))

            # Process each sheet based on its name
            for sheet_name, data in sheet_data.items():
                model_name = get_model_name_for_sheet(sheet_name)
                if model_name:
                    model = globals().get(model_name)
                    if model:
                        for item in data:
                            # Add the user_id to the item before processing
                            item['user_id'] = user_id
                            # Handle the model data with validation
                            # if not validate_item(data):
                            #     return jsonify({"error": f"Missing required fields in the sheet '{sheet_name}'"}), 400
                            handle_model_data(model, item)
                    else:
                        return jsonify({"error": f"Model for sheet '{sheet_name}' not found"}), 500

            db.session.commit()
            return jsonify({"message": "Data uploaded successfully"}), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    def get_model_name_for_sheet(sheet_name):
        # Map sheet names to model names
        sheet_to_model = {
            'Manage Defects': 'New_defects',
            'Test Execution Status': 'Test_execution_status',
            'Total Defect Status': 'Total_Defect_Status',
            'Build Status': 'BuildStatus',
            'Defect AcceptedRejected': 'DefectAcceptedRejected',
            'Test Case Creation Status': 'TestCaseCreationStatus',
        }
        return sheet_to_model.get(sheet_name)

    def validate_item(item):
        print("Itemegfdhjskhj : ", item)
        # Check that no required fields are missing or null
        required_fields = [
            'regression_defect', 'functional_defect', 'defect_reopened', 'uat_defect', 'project_name_id',
            'total_execution', 'tc_execution', 'pass_count', 'fail_count', 'no_run', 'blocked', 
            'total_defect', 'defect_closed', 'open_defect', 'critical', 'high', 'medium', 'low', 
            'total_build_received', 'builds_accepted', 'builds_rejected', 'total_defects', 'dev_team_accepted',
            'dev_team_rejected', 'total_test_case_created', 'test_case_approved', 'test_case_rejected'
        ]   
        
        for field in required_fields:
            if field not in item or item[field] is None:
                return False
        return True

    def handle_model_data(model, item):
        try:
            if 'month' not in item:
                item['month'] = datetime.today().strftime('%B')  # Default to current month
            
            # Use specific handlers for each model
            if model == New_defects:
                handle_new_defect_item(item, model)
            elif model == Test_execution_status:
                handle_test_execution_item(item, model)
            elif model == Total_Defect_Status:
                handle_total_defect_status_item(item, model)
            elif model == BuildStatus:
                handle_build_status_item(item, model)
            elif model == DefectAcceptedRejected:
                handle_defect_accepted_rejected_item(item, model)
            elif model == TestCaseCreationStatus:
                handle_test_case_creation_status_item(item, model)
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error processing item: {e}")
        
        db.session.commit()  # Commit after processing


    # In your handle_model_data functions, replace project_name_id with project_name

    def handle_new_defect_item(item, model):
        try:
            month = item.get('month', datetime.today().strftime('%B'))  # Default to current month
            _date = date.today()

            # Lookup the project_name object based on the provided project name (which is in the item)
            project_name = Project_name.query.filter_by(project_name=item['project_name_id']).first()
            if not project_name:
                raise Exception(f"Project name '{item['project_name']}' not found.")

            # Create a new defect with the project_name relationship
            new_defect = model(
                date=_date,
                month=month,
                regression_defect=item['regression_defect'],
                functional_defect=item['functional_defect'],
                defect_reopened=item['defect_reopened'],
                uat_defect=item['uat_defect'],
                project_name_id=int(project_name.id),  # Assign project_name, not project_name_id
                user_id=item['user_id']
            )
            db.session.add(new_defect)
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error processing new defect item: {e}")

    def handle_test_execution_item(item, model):
        try:
            month = item.get('month', datetime.today().strftime('%B'))  # Default to current month
            _date = date.today()

            # Lookup the project_name object based on the provided project name (which is in the item)
            project_name = Project_name.query.filter_by(project_name=item['project_name_id']).first()
            if not project_name:
                raise Exception(f"Project name '{item['project_name']}' not found.")

            test_execution = model(
                date=_date,
                month=month,
                total_execution=item['total_execution'],
                tc_execution=item['tc_execution'],
                pass_count=item['pass_count'],
                fail_count=item['fail_count'],
                no_run=item['no_run'],
                blocked=item['blocked'],
                project_name_id=project_name.id,  # Assign project_name, not project_name_id
                user_id=item['user_id']
            )
            db.session.add(test_execution)
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error processing test execution item: {e}")

    def handle_total_defect_status_item(item, model):
        try:
            month = item.get('month', datetime.today().strftime('%B'))  # Default to current month
            _date = date.today()

            # Lookup the project_name object based on the provided project name (which is in the item)
            project_name = Project_name.query.filter_by(project_name=item['project_name_id']).first()
            if not project_name:
                raise Exception(f"Project name '{item['project_name']}' not found.")

            total_defect_status = model(
                date=_date,
                month=month,
                total_defect=item['total_defect'],
                defect_closed=item['defects_closed'],
                open_defect=item['open_defect'],
                critical=item['critical'],
                high=item['high'],
                medium=item['medium'],
                low=item['low'],
                project_name_id=project_name.id,  # Assign project_name, not project_name_id
                user_id=item['user_id']
            )
            db.session.add(total_defect_status)
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error processing total defect status item: {e}")

    def handle_build_status_item(item, model):
        try:
            month = item.get('month', datetime.today().strftime('%B'))  # Default to current month
            _date = date.today()

            # Lookup the project_name object based on the provided project name (which is in the item)
            project_name = Project_name.query.filter_by(project_name=item['project_name_id']).first()
            if not project_name:
                raise Exception(f"Project name '{item['project_name']}' not found.")
            print(project_name.id)
            build_status = model(
                date=_date,
                month=month,
                total_build_received=item['total_build_received'],
                builds_accepted=item['builds_accepted'],
                builds_rejected=item['builds_rejected'],
                project_name_id=project_name.id,  # Pass project_name_id here
                user_id=item['user_id']
            )
            print("ok for handle build state")
            db.session.add(build_status)
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error processing build status item: {e}")

    def handle_defect_accepted_rejected_item(item, model):
        try:
            month = item.get('month', datetime.today().strftime('%B'))  # Default to current month
            _date = date.today()

            # Lookup the project_name object based on the provided project name (which is in the item)
            project_name = Project_name.query.filter_by(project_name=item['project_name_id']).first()
            if not project_name:
                raise Exception(f"Project name '{item['project_name']}' not found.")

            defect_accepted_rejected = model(
                date=_date,
                month=month,
                total_defects=item['total_defects'],
                dev_team_accepted=item['dev_team_accepted'],
                dev_team_rejected=item['dev_team_rejected'],
                project_name_id=project_name.id,  # Assign project_name, not project_name_id
                user_id=item['user_id']
            )
            db.session.add(defect_accepted_rejected)
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error processing defect accepted/rejected item: {e}")

    def handle_test_case_creation_status_item(item, model):
        try:
            month = item.get('month', datetime.today().strftime('%B'))  # Default to current month
            _date = date.today()

            # Lookup the project_name object based on the provided project name (which is in the item)
            project_name = Project_name.query.filter_by(project_name=item['project_name_id']).first()
            if not project_name:
                raise Exception(f"Project name '{item['project_name']}' not found.")

            test_case_creation_status = model(
                date=_date,
                month=month,
                total_test_case_created=item['total_test_case_created'],
                test_case_approved=item['test_case_approved'],
                test_case_rejected=item['test_case_rejected'],
                project_name_id=project_name.id,  # Assign project_name, not project_name_id
                user_id=item['user_id']
            )
            db.session.add(test_case_creation_status)
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error processing test case creation status item: {e}")

