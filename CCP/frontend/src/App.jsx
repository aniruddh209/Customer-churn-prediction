import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, BarChart3, BrainCircuit, CheckCircle2,
  ChevronRight, CircleHelp, Cpu, Gauge, History, Layers, LayoutDashboard, Menu,
  Moon, PanelLeftClose, RefreshCw, ShieldCheck, Sparkles, Target,
  TrendingUp, UserRound, Users, X, Zap
} from "lucide-react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:5000";

const initialForm = {
  gender: "Male",
  SeniorCitizen: 0,
  Partner: "Yes",
  Dependents: "No",
  tenure: 12,
  PhoneService: "Yes",
  MultipleLines: "No",
  InternetService: "Fiber optic",
  OnlineSecurity: "No",
  OnlineBackup: "Yes",
  DeviceProtection: "No",
  TechSupport: "No",
  StreamingTV: "Yes",
  StreamingMovies: "Yes",
  Contract: "Month-to-month",
  PaperlessBilling: "Yes",
  PaymentMethod: "Electronic check",
  MonthlyCharges: 75.5,
  TotalCharges: 900,
};

const modelRows = [
  { model: "Logistic Regression", accuracy: 80.6, precision: 65.7, recall: 55.9, f1: 60.4, auc: 84.2, recommended: true, desc: "Best overall balance & interpretability" },
  { model: "AdaBoost", accuracy: 79.7, precision: 66.1, recall: 48.4, f1: 55.9, auc: 84.5, desc: "Highest ROC-AUC ranking score" },
  { model: "Gradient Boosting", accuracy: 79.8, precision: 65.3, recall: 51.3, f1: 57.5, auc: 84.2, desc: "Robust sequential tree boosting" },
  { model: "Random Forest", accuracy: 80.4, precision: 68.0, recall: 49.5, f1: 57.3, auc: 84.1, desc: "Highest Precision for lower false positives" },
  { model: "Decision Tree", accuracy: 79.4, precision: 63.0, recall: 54.5, f1: 58.5, auc: 82.8, desc: "Single deep decision tree rules" },
  { model: "K-Nearest Neighbors", accuracy: 76.7, precision: 56.3, recall: 54.8, f1: 55.6, auc: 80.1, desc: "Distance-based local cluster matching" },
  { model: "Support Vector Machine", accuracy: 79.3, precision: 65.0, recall: 47.6, f1: 54.9, auc: 79.3, desc: "Hyperplane classification with probability scaling" },
];

function App() {
  const [sidebar, setSidebar] = useState(true);
  const [dark, setDark] = useState(true);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("churn_history") || "[]"));
  const [lastResult, setLastResult] = useState(() => JSON.parse(localStorage.getItem("last_churn_result") || "null"));

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const addHistory = (entry) => {
    const next = [entry, ...history].slice(0, 20);
    setHistory(next);
    localStorage.setItem("churn_history", JSON.stringify(next));
    setLastResult(entry);
    localStorage.setItem("last_churn_result", JSON.stringify(entry));
  };

  return (
    <div className="shell">
      <Sidebar open={sidebar} setOpen={setSidebar} dark={dark} />
      <div className={`main ${sidebar ? "" : "expanded"}`}>
        <Topbar sidebar={sidebar} setSidebar={setSidebar} dark={dark} setDark={setDark} />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard history={history} lastResult={lastResult} />} />
            <Route path="/predict" element={<Predict onPrediction={addHistory} />} />
            <Route path="/model-sandbox" element={<ModelSandbox onPrediction={addHistory} />} />
            <Route path="/result" element={<Result result={lastResult} />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/history" element={<HistoryPage history={history} setHistory={setHistory} />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Dashboard history={history} lastResult={lastResult} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ open, setOpen }) {
  const links = [
    ["/", "Dashboard", LayoutDashboard],
    ["/predict", "Predict Customer", Target],
    ["/model-sandbox", "Model Sandbox", Cpu],
    ["/performance", "Model Performance", BarChart3],
    ["/history", "Prediction History", History],
    ["/how-it-works", "How It Works", BrainCircuit],
    ["/about", "About Project", CircleHelp],
  ];
  return (
    <aside className={`sidebar ${open ? "" : "collapsed"}`}>
      <div className="brand">
        <div className="brand-mark"><Sparkles size={18}/></div>
        {open && <div><b>ChurnIQ</b><span>Customer Intelligence</span></div>}
      </div>
      <nav>
        {links.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} className={({isActive}) => `nav-item ${isActive ? "active" : ""}`}>
            <Icon size={19} />
            {open && <span>{label}</span>}
            {open && to === "/predict" && <span className="nav-badge">AI</span>}
            {open && to === "/model-sandbox" && <span className="nav-badge">7 Models</span>}
          </NavLink>
        ))}
      </nav>
      {open && (
        <div className="sidebar-card">
          <div className="mini-icon"><ShieldCheck size={17}/></div>
          <div>
            <b>Multi-Model API</b>
            <span>7 Pipelines ready</span>
          </div>
        </div>
      )}
      <button className="collapse-btn" onClick={() => setOpen(!open)}>
        {open ? <PanelLeftClose size={18}/> : <Menu size={18}/>}
        {open && "Collapse"}
      </button>
    </aside>
  );
}

function Topbar({ setSidebar, dark, setDark }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={() => setSidebar(v => !v)}><Menu size={20}/></button>
      <div className="breadcrumbs"><span>ChurnIQ</span><ChevronRight size={14}/><b>Customer Churn Intelligence</b></div>
      <div className="top-actions">
        <span className="status"><i></i> API Connected</span>
        <button className="icon-btn" title="Toggle theme" onClick={() => setDark(v => !v)}>
          {dark ? <Moon size={18}/> : <Sparkles size={18}/>}
        </button>
        <div className="avatar"><UserRound size={17}/></div>
      </div>
    </header>
  );
}

function PageTitle({ eyebrow, title, subtitle, action }) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Stat({ icon: Icon, label, value, hint, tone = "" }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={20}/></div>
      <div className="stat-body"><span>{label}</span><strong>{value}</strong><small>{hint}</small></div>
    </div>
  );
}

function Dashboard({ history, lastResult }) {
  const total = history.length;
  const high = history.filter(x => x.risk === "High").length;
  return (
    <>
      <PageTitle
        eyebrow="OVERVIEW"
        title="Customer churn command center"
        subtitle="Monitor predictions, model quality, and test customer risk across algorithms."
        action={
          <div style={{display:"flex", gap: "10px"}}>
            <Link className="secondary-btn" to="/model-sandbox"><Cpu size={17}/> Model Sandbox</Link>
            <Link className="primary-btn" to="/predict"><Zap size={17}/> New prediction</Link>
          </div>
        }
      />
      <section className="hero">
        <div className="hero-copy">
          <div className="pill"><Sparkles size={14}/> Multi-Model Retention Intelligence</div>
          <h2>Know who may leave<br/><em>before they do.</em></h2>
          <p>Score customers instantly using production pipelines. Choose Logistic Regression for optimal balance or switch models in the Model Sandbox.</p>
          <div style={{display:"flex", gap:"12px"}}>
            <Link to="/predict" className="hero-btn">Predict customer <ChevronRight size={17}/></Link>
            <Link to="/model-sandbox" className="secondary-btn" style={{padding:"14px 20px"}}>Try Other Models <Cpu size={17}/></Link>
          </div>
        </div>
        <div className="hero-orb">
          <div className="orb-ring ring1"></div><div className="orb-ring ring2"></div>
          <div className="orb-core"><Activity size={30}/><span>84.5%</span><small>ROC-AUC</small></div>
        </div>
      </section>
      <div className="stats-grid">
        <Stat icon={Gauge} label="Model accuracy" value="80.6%" hint="Logistic Regression" tone="purple"/>
        <Stat icon={TrendingUp} label="ROC-AUC" value="84.2%" hint="Selected pipeline" tone="green"/>
        <Stat icon={Target} label="Recall" value="55.9%" hint="Churn detection" tone="orange"/>
        <Stat icon={Users} label="Predictions made" value={total} hint={total ? `${high} high-risk` : "Start your first prediction"} tone="blue"/>
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-head"><div><h3>Latest prediction</h3><span>Most recent customer score</span></div><Link to="/result">View result <ChevronRight size={15}/></Link></div>
          {lastResult ? (
            <div className="latest-result">
              <div className={`risk-circle ${lastResult.risk.toLowerCase()}`}><span>{lastResult.probability}%</span><small>risk</small></div>
              <div>
                <b>{lastResult.churn === "Yes" ? "Customer likely to churn" : "Customer likely to stay"}</b>
                <p>Risk classification: <strong>{lastResult.risk}</strong> {lastResult.used_model && <small style={{display:"block", marginTop:"4px", color:"var(--accent)"}}>Model: {lastResult.used_model}</small>}</p>
              </div>
            </div>
          ) : <Empty text="No prediction yet. Run a customer assessment to see it here." />}
        </div>
        <div className="card">
          <div className="card-head"><div><h3>Model leaderboard</h3><span>7 Algorithms benchmarked</span></div><Link to="/model-sandbox">Try Sandbox <ChevronRight size={15}/></Link></div>
          <div className="metric-list">
            {modelRows.map((m, i) => <div className="metric-row" key={m.model}><span>{i+1}. {m.model}</span><div className="bar"><i style={{width:`${m.auc}%`}}></i></div><b>{m.auc}%</b></div>)}
          </div>
        </div>
      </div>
    </>
  );
}

function Predict({ onPrediction }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const update = (key, value) => setForm(v => ({...v, [key]: ["SeniorCitizen","tenure","MonthlyCharges","TotalCharges"].includes(key) ? Number(value) : value}));

  async function submit(e) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, model_name: "Logistic Regression" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Prediction failed");
      onPrediction({ ...data, timestamp: new Date().toISOString(), customer: { ...form }, used_model: "Logistic Regression" });
      navigate("/result");
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <>
      <PageTitle eyebrow="PRODUCTION MODEL" title="Assess customer (Logistic Regression)" subtitle="Predict using the production model pipeline (Accuracy: 80.6%, ROC-AUC: 84.2%)." action={<Link to="/model-sandbox" className="secondary-btn"><Cpu size={16}/> Try Other Models</Link>} />
      <FormBody form={form} update={update} submit={submit} loading={loading} error={error} buttonLabel="Predict churn (Logistic Regression)" />
    </>
  );
}

function ModelSandbox({ onPrediction }) {
  const [selectedModel, setSelectedModel] = useState("Logistic Regression");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const currentMeta = useMemo(() => modelRows.find(m => m.model === selectedModel) || modelRows[0], [selectedModel]);
  const update = (key, value) => setForm(v => ({...v, [key]: ["SeniorCitizen","tenure","MonthlyCharges","TotalCharges"].includes(key) ? Number(value) : value}));

  async function submit(e) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, model_name: selectedModel })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Prediction failed");
      onPrediction({ ...data, timestamp: new Date().toISOString(), customer: { ...form }, used_model: selectedModel });
      navigate("/result");
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <>
      <PageTitle eyebrow="MULTI-MODEL SANDBOX" title="Test prediction across algorithms" subtitle="Select any of the 7 trained models to score the customer profile." />
      
      <div className="card" style={{marginBottom: "24px"}}>
        <div className="card-head">
          <div>
            <h3>1. Select Algorithm</h3>
            <span>Choose a machine learning model to evaluate its prediction</span>
          </div>
          <span className="table-pill">{currentMeta.model}</span>
        </div>
        
        <div className="snapshot-grid" style={{gridTemplateColumns: "repeat(4, 1fr)", marginBottom: "16px"}}>
          {modelRows.map(m => (
            <div
              key={m.model}
              onClick={() => setSelectedModel(m.model)}
              style={{
                cursor: "pointer",
                border: m.model === selectedModel ? "2px solid var(--accent)" : "1px solid var(--border)",
                background: m.model === selectedModel ? "var(--accent-glow)" : "var(--surface2)",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <b style={{fontSize: "12px"}}>{m.model}</b>
                {m.recommended && <small style={{background: "var(--accent)", color: "#fff", padding: "1px 5px", borderRadius: "4px", fontSize: "8px"}}>BEST</small>}
              </div>
              <span style={{marginTop: "6px", display: "block"}}>Accuracy: <b>{m.accuracy}%</b> | AUC: <b>{m.auc}%</b></span>
            </div>
          ))}
        </div>

        <div className="callout" style={{background: "var(--surface2)", borderColor: "var(--border)", color: "var(--text)"}}>
          <Cpu size={18} style={{color: "var(--accent)"}}/>
          <div>
            <strong>Selected: {currentMeta.model}</strong> — <span style={{color: "var(--muted)"}}>{currentMeta.desc}. Accuracy: <b>{currentMeta.accuracy}%</b>, ROC-AUC: <b>{currentMeta.auc}%</b>, F1: <b>{currentMeta.f1}%</b>, Precision: <b>{currentMeta.precision}%</b>, Recall: <b>{currentMeta.recall}%</b></span>
          </div>
        </div>
      </div>

      <FormBody form={form} update={update} submit={submit} loading={loading} error={error} buttonLabel={`Predict with ${selectedModel}`} />
    </>
  );
}

function FormBody({ form, update, submit, loading, error, buttonLabel }) {
  const fields = [
    ["gender","Gender",["Male","Female"]],
    ["SeniorCitizen","Senior Citizen",["0","1"]],
    ["Partner","Partner",["Yes","No"]],
    ["Dependents","Dependents",["Yes","No"]],
    ["tenure","Tenure (months)","number"],
    ["PhoneService","Phone Service",["Yes","No"]],
    ["MultipleLines","Multiple Lines",["No","Yes","No phone service"]],
    ["InternetService","Internet Service",["DSL","Fiber optic","No"]],
    ["OnlineSecurity","Online Security",["No","Yes","No internet service"]],
    ["OnlineBackup","Online Backup",["No","Yes","No internet service"]],
    ["DeviceProtection","Device Protection",["No","Yes","No internet service"]],
    ["TechSupport","Tech Support",["No","Yes","No internet service"]],
    ["StreamingTV","Streaming TV",["No","Yes","No internet service"]],
    ["StreamingMovies","Streaming Movies",["No","Yes","No internet service"]],
    ["Contract","Contract",["Month-to-month","One year","Two year"]],
    ["PaperlessBilling","Paperless Billing",["Yes","No"]],
    ["PaymentMethod","Payment Method",["Electronic check","Mailed check","Bank transfer (automatic)","Credit card (automatic)"]],
    ["MonthlyCharges","Monthly Charges","number"],
    ["TotalCharges","Total Charges","number"],
  ];

  return (
    <form onSubmit={submit}>
      <div className="form-layout">
        <div className="card form-card">
          <div className="form-section-head"><div className="section-number">01</div><div><h3>Customer profile</h3><p>Basic customer and service information</p></div></div>
          <div className="form-grid">
            {fields.slice(0,8).map(f => <Field key={f[0]} f={f} value={form[f[0]]} update={update}/>)}
          </div>
        </div>
        <div className="card form-card">
          <div className="form-section-head"><div className="section-number">02</div><div><h3>Services</h3><p>Products and support currently enabled</p></div></div>
          <div className="form-grid">
            {fields.slice(8,14).map(f => <Field key={f[0]} f={f} value={form[f[0]]} update={update}/>)}
          </div>
        </div>
        <div className="card form-card">
          <div className="form-section-head"><div className="section-number">03</div><div><h3>Billing & contract</h3><p>Commercial and payment information</p></div></div>
          <div className="form-grid">
            {fields.slice(14).map(f => <Field key={f[0]} f={f} value={form[f[0]]} update={update}/>)}
          </div>
        </div>
      </div>
      {error && <div className="error-box"><AlertTriangle size={18}/><div><b>Prediction failed</b><span>{error}</span></div></div>}
      <div className="submit-row">
        <div><ShieldCheck size={18}/><span>Your input is processed live through backend scikit-learn pipelines.</span></div>
        <button className="primary-btn big" disabled={loading}>{loading ? <><RefreshCw className="spin" size={18}/> Scoring customer…</> : <><Zap size={18}/> {buttonLabel}</>}</button>
      </div>
    </form>
  );
}

function Field({ f, value, update }) {
  const [key,label,typeOrOptions] = f;
  return <label className="field"><span>{label}</span>{typeOrOptions === "number" ? (
    <input type="number" step={key.includes("Charges") ? "0.01" : "1"} min="0" value={value} onChange={e=>update(key,e.target.value)}/>
  ) : (
    <select value={value} onChange={e=>update(key,e.target.value)}>
      {typeOrOptions.map(o => <option key={o} value={key==="SeniorCitizen" ? Number(o) : o}>{key==="SeniorCitizen" ? (o==="1" ? "Yes" : "No") : o}</option>)}
    </select>
  )}</label>;
}

function Result({ result }) {
  const navigate = useNavigate();
  if (!result) return <EmptyPage title="No prediction yet" text="Run a customer prediction first." action={<Link className="primary-btn" to="/predict">Start prediction</Link>} />;
  const p = Number(result.probability);
  const message = result.churn === "Yes" ? "This customer shows a meaningful likelihood of churn." : "This customer currently shows a lower likelihood of churn.";
  const usedModelName = result.used_model || "Logistic Regression";
  const usedMeta = modelRows.find(m => m.model === usedModelName) || modelRows[0];

  return (
    <>
      <PageTitle
        eyebrow="PREDICTION RESULT"
        title="Customer risk assessment"
        subtitle={`Model-generated churn score computed using ${usedModelName}.`}
        action={
          <div style={{display:"flex", gap:"10px"}}>
            <button className="secondary-btn" onClick={()=>navigate("/model-sandbox")}><Cpu size={16}/> Try Other Models</button>
            <button className="primary-btn" onClick={()=>navigate("/predict")}><RefreshCw size={16}/> Score Another</button>
          </div>
        }
      />
      <div className={`result-hero ${result.risk.toLowerCase()}`}>
        <div className="result-main">
          <div className="result-kicker"><CheckCircle2 size={16}/> Prediction complete</div>
          <h2>{result.churn === "Yes" ? "Likely to churn" : "Likely to stay"}</h2>
          <p>{message}</p>
          <div className="result-tags">
            <span>Risk: <b>{result.risk}</b></span>
            <span>Prediction: <b>{result.prediction}</b></span>
            <span>Model: <b>{usedModelName}</b></span>
          </div>
        </div>
        <div className="score-dial" style={{"--p":`${Math.min(p,100)*3.6}deg`}}>
          <div><strong>{p}%</strong><span>churn probability</span></div>
        </div>
      </div>
      <div className="three-col">
        <div className="card insight"><div className="insight-icon orange"><AlertTriangle size={18}/></div><span>Risk level</span><b>{result.risk}</b><small>Threshold classification</small></div>
        <div className="card insight"><div className="insight-icon purple"><Gauge size={18}/></div><span>Model ROC-AUC</span><b>{usedMeta.auc}%</b><small>{usedModelName}</small></div>
        <div className="card insight"><div className="insight-icon green"><Target size={18}/></div><span>Model Accuracy</span><b>{usedMeta.accuracy}%</b><small>Test Set Score</small></div>
      </div>
      {result.customer && <div className="card">
        <div className="card-head"><div><h3>Customer snapshot</h3><span>Values used for this prediction</span></div></div>
        <div className="snapshot-grid">
          <Snapshot label="Contract" value={result.customer.Contract}/>
          <Snapshot label="Tenure" value={`${result.customer.tenure} months`}/>
          <Snapshot label="Internet" value={result.customer.InternetService}/>
          <Snapshot label="Monthly charges" value={`$${result.customer.MonthlyCharges}`}/>
          <Snapshot label="Payment" value={result.customer.PaymentMethod}/>
          <Snapshot label="Paperless" value={result.customer.PaperlessBilling}/>
        </div>
      </div>}
    </>
  );
}

function Snapshot({label,value}) { return <div><span>{label}</span><b>{value}</b></div>; }

function Performance() {
  const best = modelRows.reduce((a,b)=>a.auc>b.auc?a:b);
  return (
    <>
      <PageTitle
        eyebrow="MODEL PERFORMANCE"
        title="Model quality & evaluation"
        subtitle="Performance metrics from all 7 benchmarked models in your project."
        action={<Link to="/model-sandbox" className="primary-btn"><Cpu size={16}/> Try Other Models</Link>}
      />
      <div className="stats-grid">
        <Stat icon={Gauge} label="Accuracy" value="80.6%" hint="Logistic Regression" tone="purple"/>
        <Stat icon={TrendingUp} label="ROC-AUC" value="84.5%" hint="Highest AUC in benchmark" tone="green"/>
        <Stat icon={Target} label="Recall" value="55.9%" hint="Churn class" tone="orange"/>
        <Stat icon={BrainCircuit} label="Selected model" value="Logistic" hint="Production pipeline" tone="blue"/>
      </div>
      <div className="card performance-card">
        <div className="card-head"><div><h3>Model comparison leaderboard</h3><span>Higher is better for each metric</span></div><span className="legend-dot">● Production model</span></div>
        <div className="table-wrap"><table><thead><tr><th>Model</th><th>Accuracy</th><th>Precision</th><th>Recall</th><th>F1-Score</th><th>ROC-AUC</th><th>Action</th></tr></thead><tbody>
          {modelRows.map(m=>(
            <tr key={m.model} className={m.recommended?"selected-row":""}>
              <td><b>{m.model}</b>{m.recommended&&<span className="table-pill">Production</span>}</td>
              <td>{m.accuracy}%</td>
              <td>{m.precision}%</td>
              <td>{m.recall}%</td>
              <td>{m.f1}%</td>
              <td><strong>{m.auc}%</strong></td>
              <td><Link to="/model-sandbox" className="secondary-btn" style={{padding:"4px 10px", fontSize:"10px"}}>Test</Link></td>
            </tr>
          ))}
        </tbody></table></div>
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-head"><div><h3>Why Logistic Regression?</h3><span>Production selection</span></div><BrainCircuit size={20}/></div>
          <p className="prose">The project selects Logistic Regression for production deployment due to its optimal F1-score (60.4%), strong accuracy (80.6%), and high ROC-AUC (84.2%) with linear model interpretability.</p>
          <div className="callout"><CheckCircle2 size={18}/><span>Recommended for the current application pipeline.</span></div>
        </div>
        <div className="card">
          <div className="card-head"><div><h3>Best benchmark</h3><span>Highest ROC-AUC in comparison</span></div><BarChart3 size={20}/></div>
          <div className="big-number">{best.auc}% <small>ROC-AUC</small></div>
          <p className="prose">{best.model} has the strongest AUC ({best.auc}%) in the multi-model evaluation.</p>
        </div>
      </div>
    </>
  );
}

function HistoryPage({history,setHistory}) {
  return (
    <>
      <PageTitle eyebrow="PREDICTION HISTORY" title="Recent customer assessments" subtitle="Your recent local browser history of predictions." action={history.length ? <button className="secondary-btn" onClick={()=>{setHistory([]);localStorage.removeItem("churn_history")}}><X size={16}/> Clear history</button> : null}/>
      <div className="card">
        {!history.length ? <Empty text="No saved predictions yet."/> : <div className="history-list">{history.map((x,i)=><div className="history-row" key={`${x.timestamp}-${i}`}><div className={`history-icon ${x.risk.toLowerCase()}`}>{x.churn==="Yes"?<AlertTriangle size={17}/>:<CheckCircle2 size={17}/>}</div><div className="history-info"><b>{x.churn==="Yes"?"Likely to churn":"Likely to stay"}</b><span>{new Date(x.timestamp).toLocaleString()} {x.used_model && `• ${x.used_model}`}</span></div><span className={`risk-pill ${x.risk.toLowerCase()}`}>{x.risk}</span><strong>{x.probability}%</strong></div>)}</div>}
      </div>
    </>
  );
}

function HowItWorks() {
  const steps = [
    ["01","Customer input","The web form collects the same customer attributes used by the trained models."],
    ["02","Preprocessing","The saved pipeline handles missing values, one-hot encoding, and numerical scaling automatically."],
    ["03","Multi-model scoring","Select from 7 algorithms (Logistic Regression, AdaBoost, Random Forest, SVM, etc.)."],
    ["04","Risk decision","The application converts probability into Low, Medium, or High risk for easy interpretation."],
  ];
  return <>
    <PageTitle eyebrow="HOW IT WORKS" title="From customer data to churn insight" subtitle="A simple production flow built around your trained scikit-learn pipelines."/>
    <div className="process-grid">{steps.map(([n,t,d])=><div className="card process" key={n}><span>{n}</span><div className="process-line"></div><h3>{t}</h3><p>{d}</p></div>)}</div>
    <div className="card architecture"><div className="arch-node">React UI</div><ChevronRight/><div className="arch-node">Flask API</div><ChevronRight/><div className="arch-node highlight">Preprocessor + Scaler</div><ChevronRight/><div className="arch-node highlight">7 Model Pipelines</div><ChevronRight/><div className="arch-node">Risk Result</div></div>
  </>;
}

function About() {
  return <>
    <PageTitle eyebrow="ABOUT THE PROJECT" title="Customer churn intelligence" subtitle="A polished full-stack machine learning solution for customer retention."/>
    <div className="two-col">
      <div className="card"><div className="about-icon"><Sparkles/></div><h3>Project goal</h3><p className="prose">Identify customers with a higher probability of leaving so a business can prioritize retention actions. The interface keeps model outputs understandable for non-technical users.</p></div>
      <div className="card"><div className="about-icon"><ShieldCheck/></div><h3>Production architecture</h3><p className="prose">The frontend sends raw customer values to Flask. The saved scikit-learn pipelines perform preprocessing and prediction on the backend, keeping the frontend simple and consistent with training.</p></div>
    </div>
    <div className="card"><div className="card-head"><div><h3>Project metrics</h3><span>From the official dataset evaluation</span></div></div><div className="snapshot-grid"><Snapshot label="Dataset" value="Customer Churn"/><Snapshot label="Production model" value="Logistic Regression"/><Snapshot label="Accuracy" value="80.6%"/><Snapshot label="ROC-AUC" value="84.2%"/><Snapshot label="Recall" value="55.9%"/><Snapshot label="Prediction API" value="Flask /predict"/></div></div>
  </>;
}

function Empty({text}) { return <div className="empty"><Activity size={20}/><span>{text}</span></div>; }
function EmptyPage({title,text,action}) { return <div className="empty-page"><div className="empty-big"><BrainCircuit size={28}/></div><h1>{title}</h1><p>{text}</p>{action}</div>; }

export default App;