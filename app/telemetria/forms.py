from flask_wtf import FlaskForm
from wtforms import TextField, IntegerField, SubmitField
from wtforms.fields.html5 import DateTimeLocalField, DateTimeField
from wtforms.validators import ValidationError, DataRequired, Length
from datetime import datetime

class TelemetriaForm(FlaskForm):
    id = IntegerField("ID")
    dataInicio = DateTimeField("Data Inicio", default=datetime.today, format="%d/%m/%Y %H:%M:%S", validators=[DataRequired(message="Voce precisa inserir a data de inicio")])
    dataFim = DateTimeField("Data Fim",  format="%d/%m/%Y %H:%M:%S", validators=[DataRequired(message="Voce precisa inserir a data final")])
    json = TextField("JSON")
    submit = SubmitField("Enviar")

    # def validate_on_submit(self):
    #     resultado = super(TelemetriaForm, self).validate()
    #     print("DATA INICIO {} | DATA FIM {}".format(self.dataInicio.data, self.dataFim.data))
    #     if self.dataInicio.data > self.dataFim.data:
    #         return False
    #     else:
    #         return resultado
