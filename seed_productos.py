import sys
sys.path.insert(0, 'backend')

from backend.app import create_app, db
from backend.app.models import Product

app = create_app()

productos = [
    ('Acrilico N3', 'Acrílico institucional N3 para uniforme INPEC.', 25000, 50, 'ACRILICO N3.jpg'),
    ('Araña con Accesorios', 'Araña táctica con accesorios completos.', 35000, 30, 'ARAÑA CON ACCESORIOS.jpg'),
    ('Araña Piernera', 'Araña piernera para dotación táctica.', 28000, 40, 'ARAÑA PIERNERA.jpg'),
    ('Bandera N3', 'Bandera institucional N3 bordada.', 22000, 60, 'BANDERA N3.jpg'),
    ('Bandera Cuadrada', 'Bandera cuadrada institucional bordada.', 20000, 60, 'BANDERA CUADRADA.jpg'),
    ('Bolso Horizontal Celular', 'Bolso horizontal porta celular táctico.', 30000, 35, 'BOLSO HORIZONTAL CEL.jpg'),
    ('Botones N3', 'Set de botones institucionales N3.', 8000, 100, 'BOTONES N3.jpg'),
    ('Camisa N3', 'Camisa institucional N3 manga larga.', 65000, 30, 'CAMISA N3.jpg'),
    ('Cartucho de Vida', 'Cartucho de vida para dotación oficial.', 18000, 50, 'CARTUCHO DE VIDA.jpg'),
    ('Chaco N3', 'Chaco institucional N3 INPEC.', 45000, 25, 'CHACO N3.jpg'),
    ('Chapuza Interior Pistola', 'Chapuza interior para pistola reglamentaria.', 40000, 20, 'CHAPUZA INT PISTOLA.jpg'),
    ('Cobija Tipo Liviano', 'Cobija tipo liviano para dotación.', 55000, 20, 'COBIJA TIPO LIVIANO.jpg'),
    ('Colcha Escudo EPN', 'Colcha con escudo EPN bordado.', 70000, 15, 'COLCHA ESCUDO EPN.jpg'),
    ('Cordones de Bota', 'Cordones de bota resistentes para dotación.', 5000, 200, 'CORDONES DE BOTA.jpg'),
    ('Correa N3', 'Correa institucional N3 INPEC.', 35000, 40, 'CORREA N3.jpg'),
    ('Correa Caiman', 'Correa caimán de alta resistencia.', 38000, 35, 'CORREA CAIMAN.jpg'),
    ('Correa Tactica Fusil', 'Correa táctica para fusil reglamentario.', 42000, 25, 'CORREA TACTICA FUSIL.jpg'),
    ('Correa Tactica', 'Correa táctica multiusos para dotación.', 40000, 40, 'CORREA TACTICA.jpg'),
    ('Escudo INPEC N3', 'Escudo INPEC bordado N3 oficial.', 15000, 80, 'ESCUDO INPEC N3.jpg'),
    ('Escudo INPEC Fatiga', 'Escudo INPEC para traje de fatiga.', 15000, 80, 'ESCUDO INPEC FATIGA.jpg'),
    ('Escudo Kepis', 'Escudo bordado para kepis oficial.', 12000, 100, 'ESCUDO KEPIS.jpg'),
    ('Escudo PJ', 'Escudo PJ bordado institucional.', 12000, 100, 'ESCUDO PJ.jpg'),
    ('Estuche Gas Lona', 'Estuche en lona para gas defensivo.', 28000, 30, 'ESTUCHE GAS LONA.jpg'),
    ('Estuche Linterna', 'Estuche porta linterna oficial.', 22000, 45, 'ESTUCHE LINTERNA ABIERTO.jpg'),
    ('Escudo GOCAN', 'Escudo GOCAN bordado institucional.', 12000, 80, 'ESUDO GOCAN.jpg'),
    ('Extensor Pistola', 'Extensor para pistola reglamentaria.', 35000, 25, 'EXTENSOR PISTOLA.jpg'),
    ('Gas Sabre', 'Gas sable defensivo para dotación.', 45000, 20, 'GAS SABRE.jpg'),
    ('Gorra Advantage', 'Gorra Advantage oficial para personal INPEC.', 35000, 50, 'GORRA ADVANTAGE.jpg'),
    ('Jineta N3', 'Jineta institucional N3 bordada.', 18000, 70, 'JINETA N3.jpg'),
    ('Jineta Rombo', 'Jineta rombo institucional bordada.', 18000, 70, 'JINETA ROMBO.jpg'),
    ('Kepis N3', 'Kepis institucional N3 oficial INPEC.', 55000, 25, 'KEPIS N3.jpg'),
    ('Libreta Bolsillo', 'Libreta de bolsillo para personal de guardia.', 8000, 150, 'LIBRETA BOLSILLO.jpg'),
    ('Libros Cuello N3', 'Libros de cuello N3 institucionales.', 10000, 100, 'LIBROS CUELLO N3.jpg'),
    ('Liga Corrugada', 'Liga corrugada para dotación táctica.', 6000, 120, 'LIGA CORRUGADA.jpg'),
    ('Liga INPEC', 'Liga oficial INPEC para uniforme.', 6000, 120, 'LIGA INPEC.jpg'),
    ('Linterna USB', 'Linterna recargable USB para servicio nocturno.', 38000, 30, 'LINTERNA USB.jpg'),
    ('Linterna UV', 'Linterna ultravioleta para inspeccion.', 42000, 20, 'LINTERNA UV.jpg'),
    ('Llave de Restriccion', 'Llave universal para restricciones.', 25000, 40, 'LLAVE DE RESTRICCION.jpg'),
    ('Llave Restriccion Smith Wesson', 'Llave para restricciones Smith & Wesson.', 30000, 30, 'LLAVE RESTRICCION SMIT WESSON.jpg'),
    ('Medias Fatiga', 'Medias de fatiga para dotación INPEC.', 12000, 100, 'MEDIAS FATIGA.jpg'),
    ('Navaja Daga', 'Navaja daga táctica para dotación.', 55000, 15, 'NAVAJA DAGA.jpg'),
    ('Pantaloneta', 'Pantaloneta institucional para dotación.', 35000, 40, 'PANTALONETA.jpg'),
    ('Pasamontana Moto', 'Pasamontaña para uso en moto y operativos.', 22000, 50, 'PASAMONTAÑA MOTO.jpg'),
    ('Panoleta', 'Pañoleta institucional para uniforme.', 15000, 60, 'PAÑOLETA.jpg'),
    ('Piernera Aleta', 'Piernera aleta táctica para dotación.', 32000, 35, 'PIERNERA ALETA.jpg'),
    ('Piernera Sencilla', 'Piernera sencilla para dotación oficial.', 28000, 40, 'PIERNERA SENCILLA.jpg'),
    ('Piocha N3', 'Piocha institucional N3 oficial.', 10000, 100, 'PIOCHA N3.jpg'),
    ('Pito', 'Pito reglamentario para personal de guardia.', 8000, 150, 'PITO.jpg'),
    ('Placa', 'Placa institucional oficial INPEC.', 20000, 60, 'PLACA.jpg'),
    ('Porta Carnet con Cinta', 'Porta carnet con cinta retractil.', 12000, 80, 'PORTA CARNET CINTA.jpg'),
    ('Porta Cubiertos', 'Porta cubiertos para dotación de campo.', 18000, 40, 'PORTA CUBIERTOS.jpg'),
    ('Porta Gas Tactico', 'Porta gas táctico para cinturón.', 28000, 35, 'PORTA GAS TACTICO.jpg'),
    ('Porta Guantes Nitrilo', 'Porta guantes de nitrilo para uniforme.', 20000, 50, 'PORTA GUANTES NITRILO.jpg'),
    ('Porta Linterna Oficial', 'Porta linterna oficial para cinturón.', 22000, 40, 'PORTA LINTERNA OFICIAL.jpg'),
    ('Porta Radio', 'Porta radio táctico para dotación.', 30000, 30, 'PORTA RADIO.jpg'),
    ('Porta Restriccion Cerrado', 'Porta restricción cerrado para cinturón.', 28000, 35, 'PORTA RESTRICCION CERRADO.jpg'),
    ('Porta Restriccion Tactico', 'Porta restricción táctico multiposición.', 32000, 30, 'PORTA RESTRICCION TACTICO.jpg'),
    ('Porta Tambo Tactico', 'Porta tambo táctico para cinturón.', 28000, 35, 'PORTA TAMBO TACTICO.jpg'),
    ('Porta Tonfa Anillo', 'Porta tonfa con anillo para cinturón.', 25000, 40, 'PORTA TONFA ANILLO.jpg'),
    ('Porta Tonfa Lona', 'Porta tonfa en lona resistente.', 22000, 40, 'PORTA TONFA LONA.jpg'),
    ('Porta Tonfa Tactico', 'Porta tonfa táctico multiposición.', 30000, 35, 'PORTA TONFA TACTICO.jpg'),
    ('Puente Escudo Bordado', 'Puente con escudo bordado institucional.', 18000, 60, 'PUENTE ESCUDO BORDADO.jpg'),
    ('Reata Oficial', 'Reata oficial para uniforme INPEC.', 15000, 80, 'REATA OFICIAL.jpg'),
    ('Reata Rigida AAA', 'Reata rígida AAA de alta resistencia.', 18000, 60, 'REATA RIGIDA AAA.jpg'),
    ('Restriccion de Dedo', 'Restricción de dedo para control de detenidos.', 22000, 50, 'RESTRICCION DE DEDO.jpg'),
    ('Restriccion Economica', 'Restricción económica desechable.', 8000, 200, 'RESTRICCION ECONOMICA.jpg'),
    ('RH Cosido', 'RH cosido para dotación oficial.', 12000, 80, 'RH COSIDO.jpg'),
    ('RH Presilla', 'RH presilla para uniforme institucional.', 12000, 80, 'RH PRESILLA.jpg'),
    ('Silla Portatil', 'Silla portátil para guardias de larga jornada.', 85000, 10, 'SILLA PORTATIL.jpg'),
    ('Tambo Corto', 'Tambo corto de defensa personal.', 65000, 20, 'TAMBO CORTO.jpg'),
    ('Tambo Largo', 'Tambo largo de defensa personal.', 75000, 15, 'TAMBO LARGO.jpg'),
    ('Tarjetero Apellido con Piochas', 'Tarjetero de apellido con piochas.', 15000, 70, 'TARJETERO APELLIDO CON PIOCHAS.jpg'),
    ('Tarjetero INPEC con Piocha', 'Tarjetero INPEC con piocha incorporada.', 15000, 70, 'TARJETERO INPEC CON PIOCHA.jpg'),
    ('Tarjetero INPEC', 'Tarjetero institucional INPEC oficial.', 12000, 80, 'TARJETERO INPEC.jpg'),
    ('Toalla Escudo EPN', 'Toalla con escudo EPN bordado.', 35000, 25, 'TOALLA ESCUDO EPN.jpg'),
    ('Toalla Escudo INPEC', 'Toalla con escudo INPEC bordado.', 35000, 25, 'TOALLA ESCUDO INPEC.jpg'),
    ('Tonfa', 'Tonfa de defensa reglamentaria INPEC.', 80000, 15, 'TONFA.jpg'),
    ('Tula Chorizo', 'Tula chorizo para transporte de dotación.', 55000, 20, 'TULA CHORIZO.jpg'),
]

with app.app_context():
    db.create_all()
    db.session.execute(db.delete(Product))
    db.session.commit()

    for nombre, desc, precio, stock, imagen in productos:
        p = Product(
            name=nombre,
            description=desc,
            price=precio,
            stock=stock,
            image_url=f'/Images/{imagen}'
        )
        db.session.add(p)

    db.session.commit()
    total = db.session.execute(db.select(db.func.count()).select_from(Product)).scalar()
    print(f'Creados {total} productos exitosamente')
