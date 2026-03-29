const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminDashboard.jsx', 'utf8');

// 1. Extract AnimatedCounter, LiveChart, StatCard
const regex = /(\s*\/\/\s*---\s*INTERACTIVE SUB-COMPONENTS\s*---[\s\S]*?)(\s*const OverviewView)/;
const match = code.match(regex);
if (match) {
    let comps = match[1];
    code = code.replace(comps, '');
    code = code.replace("import { useAuth } from '../../context/AuthContext';\n", "import { useAuth } from '../../context/AuthContext';\n" + comps + "\n");
}

// 2. Change OverviewView and ProductsView invocations
code = code.replace(/<OverviewView key="overview" \/>/g, '{OverviewView()}');
code = code.replace(/<ProductsView key="products" \/>/g, '{ProductsView()}');

// 3. Add key attributes to OverviewView and ProductsView roots
code = code.replace(
    /const OverviewView = \(\) => \(\s*<motion\.div initial=\{\{ opacity: 0 \}\} animate=\{\{ opacity: 1 \}\} className="space-y-8">/,
    'const OverviewView = () => (\n        <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">'
);

code = code.replace(
    /const ProductsView = \(\) => \(\s*<motion\.div initial=\{\{ opacity: 0 \}\} animate=\{\{ opacity: 1 \}\} className="space-y-6">/,
    'const ProductsView = () => (\n        <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">'
);

fs.writeFileSync('src/pages/admin/AdminDashboard.jsx', code);
