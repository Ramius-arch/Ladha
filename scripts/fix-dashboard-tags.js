const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../billing/frontend/src/pages/Dashboard.vue');
let c = fs.readFileSync(p, 'utf8');

const target = `          <div class="health-card mt-6">
            <div class="health-top">
              <span class="health-title">Service Integrity</span>
              <span class="health-val text-emerald-400">99.98%</span>
            </div>
            <div class="health-bar-track">
              <div class="health-bar-fill" style="width: 99.98%;"></div>
            </div>
          </div>
        </div>`;

c = c.replace(target, '');
fs.writeFileSync(p, c, 'utf8');
console.log('Duplicate tag removed from Dashboard.vue');
