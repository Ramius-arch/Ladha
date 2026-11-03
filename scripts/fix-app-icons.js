const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../billing/frontend/src/App.vue');
let c = fs.readFileSync(p, 'utf8');

// Ensure ShoppingCartOutlined and AccountBookOutlined are in the imports
const oldImport = `  MenuOutlined,
  ShoppingOutlined,
} from '@ant-design/icons-vue';`;

const newImport = `  MenuOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  AccountBookOutlined,
} from '@ant-design/icons-vue';`;

if (c.includes(oldImport)) {
  c = c.replace(oldImport, newImport);
}

// Ensure they are in the components declaration
const oldComponents = `    MenuOutlined,
    ShoppingOutlined,
  },`;

const newComponents = `    MenuOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    AccountBookOutlined,
  },`;

if (c.includes(oldComponents)) {
  c = c.replace(oldComponents, newComponents);
}

fs.writeFileSync(p, c, 'utf8');
console.log('App.vue imports and components fixed successfully');
