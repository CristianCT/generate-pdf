const express = require('express');
const morgan = require('morgan');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const app = express();

/* Codigo de prueba */
const data = {
    codigo_fatura: 'GGC-004759',
    fecha_expedicion: '29/MAR/2020',
    fecha_pago: '29/MAR/2020',
    nombre_cliente: 'Andres David Hurtado Luna',
    email_cliente: 'andresDavid@gmail.com',
    direccion: 'Esta es mi dirección',
    telefono: 3219876543,
    articulos: [{
            codigo_articulo: 'GGC-123',
            nombre: 'Betun De Cejas Fino 1A',
            descripcion: 'Descripcion del betun',
            cantidad: 2,
            valor_final: 2000,
            subtotal: 4000
        },
        {
            codigo_articulo: 'GGC-123',
            nombre: 'Betun De Cejas Fino 1A',
            descripcion: 'Descripcion del betun',
            cantidad: 2,
            valor_final: 2000,
            subtotal: 4000
        },
        {
            codigo_articulo: 'GGC-123',
            nombre: 'Betun De Cejas Fino 1A',
            descripcion: 'Descripcion del betun',
            cantidad: 2,
            valor_final: 2000,
            subtotal: 4000
        },
        {
            codigo_articulo: 'GGC-123',
            nombre: 'Betun De Cejas Fino 1A',
            descripcion: 'Descripcion del betun',
            cantidad: 2,
            valor_final: 2000,
            subtotal: 4000
        },
        {
            codigo_articulo: 'GGC-123',
            nombre: 'Betun De Cejas Fino 1A',
            descripcion: 'Descripcion del betun',
            cantidad: 2,
            valor_final: 2000,
            subtotal: 4000
        }
    ],
    total_pedido: 8000
}

app.use(morgan('dev'));

const compile = async function(templateName, data) {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
}

hbs.registerHelper('dateFormat', function(value, format) {
    return moment(value).format(format);
});

app.get('/', async(req, res, next) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const content = await compile('factura', data);
        await page.setContent(content);
        await page.pdf({
            path: 'myPDF.pdf',
            format: 'A4',
            printBackground: true
        });
        console.log('done');
        await browser.close();
        process.exit();
    } catch (error) {
        console.log(error);
    }

});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log('Server on port ' + app.get('port'));
});

module.exports = app;