from flask import Flask, jsonify, request, send_file
from models import db, Users, Project_name, Project_details, New_defects, Total_Defect_Status, Test_execution_status, Testers, TestCaseCreationStatus, DefectAcceptedRejected, BuildStatus
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import pandas as pd
import datetime
from datetime import datetime
import plotly.graph_objects as go
import plotly.io as pio
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from io import BytesIO
import os
import tempfile

def pdf_generator_report(app):
    @app.route('/pdf_report', methods=['GET'])
    def generate_pdf_report():
        # Example data for the bar chart (replace with actual data)
        x_data_bar = ['Tester1', 'Tester2', 'Tester3', 'Tester4', 'Tester5']
        y_data_bar = [90, 85, 92, 88, 80]

        # Generate a Plotly bar chart (bar chart)
        bar_fig = go.Figure(data=[go.Bar(x=x_data_bar, y=y_data_bar, name='Tester Scores')])

        # Example data for the line chart (week chart)
        weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
        progress = [10, 20, 30, 40, 50]

        # Generate a Plotly line chart (week chart)
        line_fig = go.Figure(data=[go.Scatter(x=weeks, y=progress, mode='lines+markers', name='Weekly Progress')])

        # Save the bar chart as an image (in-memory file)
        bar_img_bytes = pio.to_image(bar_fig, format='png')
        # Save the line chart as an image (in-memory file)
        line_img_bytes = pio.to_image(line_fig, format='png')

        # Create a temporary file to save the bar chart image on disk
        temp_bar_img_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
        temp_bar_img_file_path = temp_bar_img_file.name
        temp_bar_img_file.write(bar_img_bytes)
        temp_bar_img_file.close()

        # Create a temporary file to save the line chart image on disk
        temp_line_img_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
        temp_line_img_file_path = temp_line_img_file.name
        temp_line_img_file.write(line_img_bytes)
        temp_line_img_file.close()

        # Create a PDF
        pdf_buffer = BytesIO()
        c = canvas.Canvas(pdf_buffer, pagesize=letter)

        # Add title with decoration
        c.setFont("Helvetica-Bold", 18)
        c.setFillColor(colors.HexColor("#1f4e79"))  # Dark Blue color for title
        c.drawString(100, 750, "Tester Performance Report")

        # Draw a horizontal line below the title for decoration
        c.setStrokeColor(colors.HexColor("#1f4e79"))
        c.setLineWidth(2)
        c.line(100, 740, 500, 740)  # Line for decoration

        # Set positions for the charts (side-by-side with proper spacing)
        chart_width = 250
        chart_height = 200
        chart_spacing = 60

        # Add Bar Chart Image (Tester Scores) - positioned on the left
        c.drawImage(temp_bar_img_file_path, 100, 450, width=chart_width, height=chart_height)
        # Add label below the Bar Chart
        c.setFont("Helvetica", 10)
        c.drawString(100, 430, "Tester Scores (Bar Chart)")

        # Add Line Chart Image (Weekly Progress) - positioned on the right
        c.drawImage(temp_line_img_file_path, 100 + chart_width + chart_spacing, 450, width=chart_width, height=chart_height)
        # Add label below the Line Chart
        c.drawString(100 + chart_width + chart_spacing, 430, "Weekly Progress (Line Chart)")

        # Add Tester Details Table with a border
        testers = [
            {"name": "Tester1", "score": 90},
            {"name": "Tester2", "score": 85},
            {"name": "Tester3", "score": 92},
            {"name": "Tester4", "score": 88},
            {"name": "Tester5", "score": 80}
        ]

        # Table header
        c.setFont("Helvetica-Bold", 12)
        y_position = 100  # Starting y-position for the table
        c.setFillColor(colors.HexColor("#1f4e79"))  # Blue header color
        c.drawString(100, y_position, "Tester Name")
        c.drawString(250, y_position, "Score")

        # Draw table header border
        c.setStrokeColor(colors.black)
        c.setLineWidth(1)
        c.rect(95, y_position - 5, 150, 15)  # Border around the header

        # Add tester data rows
        c.setFont("Helvetica", 10)
        y_position -= 20  # Adjust y-position for rows

        for tester in testers:
            c.drawString(100, y_position, tester["name"])
            c.drawString(250, y_position, str(tester["score"]))
            y_position -= 15

        # Draw table borders
        c.rect(95, 100 - 5, 150, y_position - 100 + 5)  # Border around the table

        # Save the PDF file in memory
        c.showPage()
        c.save()

        pdf_buffer.seek(0)

        # Clean up by deleting the temporary image files
        os.remove(temp_bar_img_file_path)
        os.remove(temp_line_img_file_path)

        # Send the PDF as a response
        return send_file(pdf_buffer, as_attachment=True, download_name="tester_report.pdf", mimetype='application/pdf')
