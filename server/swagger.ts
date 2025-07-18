import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

const router = express.Router();

// Load OpenAPI specification
const apiSpec = yaml.load(path.join(__dirname, '../api-spec.yaml'));

// Custom CSS for Swagger UI
const customCss = `
  .swagger-ui .topbar { display: none; }
  .swagger-ui .info { margin: 20px 0; }
  .swagger-ui .info .title { color: #1976d2; }
  .swagger-ui .scheme-container { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
  .swagger-ui .btn.authorize { background-color: #1976d2; border-color: #1976d2; }
  .swagger-ui .btn.authorize:hover { background-color: #1565c0; border-color: #1565c0; }
`;

// Swagger UI options
const swaggerOptions = {
  customCss,
  customSiteTitle: 'Blood Disease Classification API',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
  },
};

// Serve Swagger UI
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(apiSpec, swaggerOptions));

// Serve raw API spec
router.get('/api-spec.yaml', (req, res) => {
  res.setHeader('Content-Type', 'application/yaml');
  res.sendFile(path.join(__dirname, '../api-spec.yaml'));
});

router.get('/api-spec.json', (req, res) => {
  res.json(apiSpec);
});

export default router;
