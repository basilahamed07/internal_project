# in this file handling the router file here (like api handling)


from routers.billable_details_route import billable_details_route
from routers.project_details_route import project_details_route
from routers.test_details_route import test_details_route
from routers.router import register_router
from routers.view_matric import test_matric_routing
from pdf_report_generatot.pdf_report_api import pdf_generator_report
from routers.Total_defect_api import total_defect_api
from ai_for_database.ai_database_sqltoolkit import ai_chatbot_routing
from routers.view_matrix_input import view_matrix_input_route





def all_router(app):
    billable_details_route(app)
    project_details_route(app)
    test_details_route(app)
    register_router(app)
    test_matric_routing(app)
    pdf_generator_report(app)
    total_defect_api(app)
    # ai_chatbot_routing(app)
    view_matrix_input_route(app)
