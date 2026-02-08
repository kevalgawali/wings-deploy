import{c as T,u as X,r as n,j as e}from"./index-CdHvm7f0.js";import{C as K,b as Z,Q as E,a as S,r as ee,v as se}from"./api-BDk3Bnt9.js";import{P as I}from"./constants-C8nX9aFr.js";import{L as ie}from"./loader-circle-XMNrH3kb.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],ne=T("copy",te);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],re=T("printer",ae),ue=()=>{const p=X(),[g,N]=n.useState(""),[d,x]=n.useState(""),[c,v]=n.useState(""),[a,u]=n.useState({}),[h,V]=n.useState(!1),[M,D]=n.useState(!1),[z,_]=n.useState(""),[m,F]=n.useState(""),[O,k]=n.useState(!1),[A,G]=n.useState(""),[L,$]=n.useState(""),w=n.useRef(null),[Y,H]=n.useState(!1),[W,y]=n.useState(!0);n.useEffect(()=>{(async()=>{y(!0);try{const t=await ee.checkViewerStatus();t.success&&t.data&&(t.data.registration_open||H(!0))}catch(t){console.error("Failed to check viewer registration status:",t)}finally{y(!1)}})()},[]);const B=()=>{const i={};return g.trim()?g.trim().length<2&&(i.fullName="Name must be at least 2 characters long"):i.fullName="Please enter your full name",d.trim()||(i.collegeName="Please enter your college/institution name"),c.trim()?/^\d{12}$/.test(c.trim())||(i.utrNumber="UTR number must be exactly 12 digits. Please check your payment receipt and enter only numbers."):i.utrNumber="Please enter the 12-digit UTR number from your payment receipt",u(i),Object.keys(i).length===0},Q=i=>{const t=i.target.value.replace(/\D/g,"").slice(0,12);v(t),a.utrNumber&&u(b=>({...b,utrNumber:""}))},f=I.VIEWER_FEE,C=I.UPI_PROTOCOL.replace("am=",`am=${f}`),q=async()=>{try{await navigator.clipboard.writeText(m),k(!0),setTimeout(()=>k(!1),2e3)}catch(i){console.error("Copy failed",i)}},J=async i=>{var t,b,P,j,U;if(i.preventDefault(),!!B()){V(!0),u({});try{const r={name:g.trim(),college_name:d.trim(),utr_number:c.trim()},o=await se.register(r);if(o&&o.success){D(!0),_(o.message||"Registered successfully");const s=((t=o.data)==null?void 0:t.registration_id)||"";F(s),G(g.trim()),$(d.trim()),N(""),x(""),v(""),setTimeout(()=>{R()},500)}else{const s=o.message||"Registration failed";u({submit:s})}}catch(r){let o="";(P=(b=r==null?void 0:r.response)==null?void 0:b.data)!=null&&P.message?o=r.response.data.message:(U=(j=r==null?void 0:r.response)==null?void 0:j.data)!=null&&U.error?o=r.response.data.error:r!=null&&r.message&&(o=r.message);const s=o.toLowerCase();let l="";s.includes("failed to fetch")||s.includes("networkerror")||s.includes("network")||s.includes("econnrefused")?l="⚠️ Unable to connect to the server. Please check your internet connection and try again.":s.includes("utr")&&(s.includes("duplicate")||s.includes("already")||s.includes("exists")||s.includes("used"))?l="⚠️ This UTR number has already been used for viewer registration. Each payment can only be used once. Please verify your UTR number from your payment confirmation.":s.includes("duplicate")||s.includes("already registered")||s.includes("already exists")?l="⚠️ You may have already registered as a viewer. Please check your confirmation or contact the coordinators.":s.includes("closed")||s.includes("registration_closed")?l="⚠️ Sorry, viewer registration is currently closed by the coordinators. Please contact them for more information.":s.includes("utr")&&(s.includes("12")||s.includes("length")||s.includes("digits"))?l="⚠️ UTR number must be exactly 12 digits. Please check your payment receipt and enter the correct UTR number.":s.includes("utr")&&s.includes("invalid")?l="⚠️ Invalid UTR number format. Please enter a valid 12-digit UTR number from your payment receipt.":s.includes("required")||s.includes("missing")?l="⚠️ Some required fields are missing. Please fill in your name, college name, and UTR number.":s.includes("too long")||s.includes("shorten")?l="⚠️ Your name or college name is too long. Please shorten it and try again.":s.includes("validation")||s.includes("invalid")?l="⚠️ "+o:s.includes("service")||s.includes("unavailable")||s.includes("503")?l="⚠️ Our servers are temporarily busy. Please wait a moment and try again.":s.includes("server")||s.includes("500")||s.includes("internal")||s.includes("unexpected")?l="⚠️ Our server encountered an error. Please try again in a few moments. If the issue persists, contact the Technical Secretary at +91 9175127989":o?l="⚠️ "+o:l="⚠️ Registration failed. Please check all your details and try again. If the problem persists, contact the Technical Secretary at +91 9175127989",u({submit:l})}finally{V(!1)}}},R=()=>{if(!w.current)return;const i=w.current.innerHTML,t=window.open("","_blank","width=600,height=800");t&&(t.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>WINGS 2026 - Entry Ticket</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@700&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
              font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #0f172a 0%, #1e1e2e 50%, #0f172a 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            
            .ticket-wrapper {
              position: relative;
            }
            
            .ticket {
              width: 380px;
              background: linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 
                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(6, 182, 212, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
              position: relative;
            }
            
            .ticket::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6);
            }
            
            .ticket-header {
              background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
              padding: 28px 24px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            
            .ticket-header::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
              animation: none;
            }
            
            .ticket-header h1 {
              color: #0f172a;
              font-size: 36px;
              font-weight: 800;
              letter-spacing: 4px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
              position: relative;
            }
            
            .ticket-header .subtitle {
              color: #0f172a;
              font-size: 13px;
              margin-top: 6px;
              font-weight: 600;
              letter-spacing: 3px;
              text-transform: uppercase;
              opacity: 0.9;
            }
            
            .ticket-body {
              padding: 28px 24px;
              background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
            }
            
            .ticket-id {
              background: linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%);
              border: 2px solid rgba(6, 182, 212, 0.3);
              border-radius: 16px;
              padding: 20px;
              text-align: center;
              margin-bottom: 24px;
              position: relative;
              overflow: hidden;
            }
            
            .ticket-id::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(45deg, transparent 30%, rgba(6, 182, 212, 0.05) 50%, transparent 70%);
            }
            
            .ticket-id-label {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 3px;
              color: #06b6d4;
              margin-bottom: 10px;
              font-weight: 600;
            }
            
            .ticket-id-value {
              font-size: 28px;
              font-weight: 800;
              color: #22d3ee;
              font-family: 'JetBrains Mono', 'Courier New', monospace;
              letter-spacing: 3px;
              text-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
            }
            
            .ticket-fields {
              display: grid;
              gap: 16px;
            }
            
            .ticket-field {
              background: rgba(255, 255, 255, 0.03);
              border-radius: 12px;
              padding: 14px 16px;
              border: 1px solid rgba(255, 255, 255, 0.06);
            }
            
            .ticket-label {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 2px;
              color: #64748b;
              margin-bottom: 6px;
              font-weight: 600;
            }
            
            .ticket-value {
              font-size: 16px;
              font-weight: 600;
              color: #f1f5f9;
              line-height: 1.4;
            }
            
            .ticket-date {
              font-size: 12px;
              color: #64748b;
              text-align: center;
              margin-top: 20px;
              padding-top: 16px;
              border-top: 1px dashed rgba(255, 255, 255, 0.1);
            }
            
            .ticket-footer {
              background: linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(6, 182, 212, 0.1) 100%);
              border-top: 2px dashed rgba(6, 182, 212, 0.2);
              padding: 20px 24px;
              text-align: center;
              position: relative;
            }
            
            .ticket-footer::before,
            .ticket-footer::after {
              content: '';
              position: absolute;
              top: -10px;
              width: 20px;
              height: 20px;
              background: linear-gradient(135deg, #0f172a 0%, #1e1e2e 100%);
              border-radius: 50%;
            }
            
            .ticket-footer::before {
              left: -10px;
            }
            
            .ticket-footer::after {
              right: -10px;
            }
            
            .ticket-footer p {
              font-size: 11px;
              color: #94a3b8;
              line-height: 1.6;
            }
            
            .ticket-footer .highlight {
              color: #06b6d4;
              font-weight: 600;
            }
            
            .decorative-line {
              height: 3px;
              background: linear-gradient(90deg, transparent, #06b6d4, #3b82f6, #8b5cf6, transparent);
              margin: 0 24px;
              border-radius: 2px;
            }
            
            @media print {
              @page {
                size: auto;
                margin: 10mm;
              }
              
              body { 
                background: white !important;
                padding: 0;
                min-height: auto;
              }
              
              .ticket {
                box-shadow: none;
                border: 2px solid #1e293b;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              .ticket-header,
              .ticket-body,
              .ticket-id,
              .ticket-field,
              .ticket-footer {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          ${i}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
              window.onafterprint = function() { window.close(); };
            };
          <\/script>
        </body>
        </html>
      `),t.document.close())};return Y?e.jsxDEV("div",{className:"min-h-screen bg-transparent flex items-center justify-center pt-28 pb-20 md:pb-0",children:e.jsxDEV("div",{className:"max-w-xl w-full mx-6 animate-fadeInUp",children:e.jsxDEV("div",{className:"bg-[#030712]/80 border border-blue-500/80 rounded-2xl p-8 md:p-12 text-center",children:[e.jsxDEV("div",{className:"w-20 h-20 bg-gradient-to-r from-red-600/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6",children:e.jsxDEV(K,{className:"text-red-400",size:40},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:470,columnNumber:15},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:469,columnNumber:13},void 0),e.jsxDEV("h2",{className:"text-2xl font-bold text-blue-400 mb-4",children:"Viewer Registration Closed"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:472,columnNumber:13},void 0),e.jsxDEV("p",{className:"text-gray-300 mb-4",children:"Viewer registrations have been closed by the coordinators."},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:473,columnNumber:13},void 0),e.jsxDEV("p",{className:"text-gray-400 text-sm mb-8",children:"For more information, please contact the event coordinators."},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:476,columnNumber:13},void 0),e.jsxDEV("div",{className:"flex flex-col sm:flex-row gap-3 justify-center",children:[e.jsxDEV("button",{onClick:()=>p("/events"),className:"px-6 py-3 rounded-lg bg-cyan-500/20 text-cyan-400 font-semibold hover:bg-cyan-500/30 transition",children:"View Events"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:480,columnNumber:15},void 0),e.jsxDEV("button",{onClick:()=>p("/"),className:"px-6 py-3 rounded-lg bg-gray-500/20 text-gray-400 font-semibold hover:bg-gray-500/30 transition",children:"Go to Home"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:486,columnNumber:15},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:479,columnNumber:13},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:468,columnNumber:11},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:467,columnNumber:9},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:466,columnNumber:7},void 0):W?e.jsxDEV("div",{className:"min-h-screen bg-transparent flex items-center justify-center pt-28 pb-20",children:e.jsxDEV("div",{className:"text-center",children:[e.jsxDEV(ie,{className:"w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:504,columnNumber:11},void 0),e.jsxDEV("p",{className:"text-gray-400",children:"Checking registration status..."},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:505,columnNumber:11},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:503,columnNumber:9},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:502,columnNumber:7},void 0):M?e.jsxDEV("div",{className:"min-h-screen bg-transparent flex items-center justify-center pt-28 pb-20 md:pb-0",children:e.jsxDEV("div",{className:"max-w-2xl w-full mx-6 animate-fadeInUp",children:e.jsxDEV("div",{className:"bg-[#030712]/80 border border-cyan-500/30 rounded-2xl p-8 md:p-12 text-center",children:[e.jsxDEV("div",{className:"w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6",children:e.jsxDEV(Z,{className:"text-cyan-400",size:32},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:517,columnNumber:15},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:516,columnNumber:13},void 0),e.jsxDEV("h2",{className:"text-2xl font-bold text-cyan-400 mb-4",children:"Registration Successful!"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:519,columnNumber:13},void 0),e.jsxDEV("p",{className:"text-gray-300 mb-6",children:z},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:520,columnNumber:13},void 0),m&&e.jsxDEV("div",{className:"mb-6",children:[e.jsxDEV("h3",{className:"text-sm font-bold text-gray-500 uppercase tracking-widest mb-3",children:"Your Registration ID"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:525,columnNumber:17},void 0),e.jsxDEV("div",{className:"rounded-2xl p-1 bg-gradient-to-br from-green-400/30 via-emerald-500/20 to-transparent shadow-lg inline-block",children:e.jsxDEV("div",{className:"bg-[#010214] rounded-xl px-6 py-4 flex items-center gap-4",children:[e.jsxDEV("span",{className:"font-mono text-xl sm:text-2xl font-bold text-green-400",children:m},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:528,columnNumber:21},void 0),e.jsxDEV("button",{type:"button",onClick:q,"aria-label":"Copy Registration ID",className:"inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-[#031022] text-sm font-semibold hover:scale-105 transition-shadow shadow-md",children:[e.jsxDEV(ne,{className:"w-4 h-4"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:535,columnNumber:23},void 0),e.jsxDEV("span",{children:O?"Copied":"Copy"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:536,columnNumber:23},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:529,columnNumber:21},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:527,columnNumber:19},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:526,columnNumber:17},void 0),e.jsxDEV("p",{className:"text-gray-400 text-xs mt-3",children:"Please save this ID for future reference"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:540,columnNumber:17},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:524,columnNumber:15},void 0),e.jsxDEV("div",{className:"mb-6",children:[e.jsxDEV("button",{type:"button",onClick:R,className:"inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-purple-500/30",children:[e.jsxDEV(re,{className:"w-5 h-5"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:551,columnNumber:17},void 0),e.jsxDEV("span",{children:"Print Entry Ticket"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:552,columnNumber:17},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:546,columnNumber:15},void 0),e.jsxDEV("p",{className:"text-gray-400 text-xs mt-2",children:"Your entry ticket will be printed automatically"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:554,columnNumber:15},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:545,columnNumber:13},void 0),e.jsxDEV("div",{ref:w,className:"hidden",children:e.jsxDEV("div",{className:"ticket-wrapper",children:e.jsxDEV("div",{className:"ticket",children:[e.jsxDEV("div",{className:"ticket-header",children:[e.jsxDEV("h1",{children:"WINGS 2026"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:562,columnNumber:21},void 0),e.jsxDEV("p",{className:"subtitle",children:"Technical Fest • GECA"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:563,columnNumber:21},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:561,columnNumber:19},void 0),e.jsxDEV("div",{className:"decorative-line"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:565,columnNumber:19},void 0),e.jsxDEV("div",{className:"ticket-body",children:[e.jsxDEV("div",{className:"ticket-id",children:[e.jsxDEV("div",{className:"ticket-id-label",children:"Registration ID"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:568,columnNumber:23},void 0),e.jsxDEV("div",{className:"ticket-id-value",children:m},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:569,columnNumber:23},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:567,columnNumber:21},void 0),e.jsxDEV("div",{className:"ticket-fields",children:[e.jsxDEV("div",{className:"ticket-field",children:[e.jsxDEV("div",{className:"ticket-label",children:"Attendee Name"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:573,columnNumber:25},void 0),e.jsxDEV("div",{className:"ticket-value",children:A},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:574,columnNumber:25},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:572,columnNumber:23},void 0),e.jsxDEV("div",{className:"ticket-field",children:[e.jsxDEV("div",{className:"ticket-label",children:"College / Institution"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:577,columnNumber:25},void 0),e.jsxDEV("div",{className:"ticket-value",children:L},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:578,columnNumber:25},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:576,columnNumber:23},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:571,columnNumber:21},void 0),e.jsxDEV("div",{className:"ticket-date",children:["📅 Registered on: ",new Date().toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:581,columnNumber:21},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:566,columnNumber:19},void 0),e.jsxDEV("div",{className:"ticket-footer",children:[e.jsxDEV("p",{children:["🎫 Please present this ticket at the ",e.jsxDEV("span",{className:"highlight",children:"venue entrance"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:586,columnNumber:61},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:586,columnNumber:21},void 0),e.jsxDEV("p",{style:{marginTop:"6px"},children:["Entry valid for ",e.jsxDEV("span",{className:"highlight",children:"one person"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:587,columnNumber:67},void 0)," only"]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:587,columnNumber:21},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:585,columnNumber:19},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:560,columnNumber:17},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:559,columnNumber:15},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:558,columnNumber:13},void 0),e.jsxDEV("div",{className:"mb-6",children:[e.jsxDEV("h3",{className:"text-sm font-bold text-gray-500 uppercase tracking-widest mb-3",children:"Payment"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:595,columnNumber:15},void 0),e.jsxDEV("div",{className:"rounded-2xl p-1 bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-transparent shadow-lg",children:e.jsxDEV("div",{className:"bg-[#010214] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4",children:[e.jsxDEV("div",{className:"flex-shrink-0 flex justify-center",children:e.jsxDEV("div",{className:"bg-white p-3 rounded-lg shadow-[0_8px_30px_rgba(2,6,23,0.6)]",children:e.jsxDEV(E,{value:C,size:180,level:"H",includeMargin:!0},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:600,columnNumber:23},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:599,columnNumber:21},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:598,columnNumber:19},void 0),e.jsxDEV("div",{className:"flex-1 text-left",children:[e.jsxDEV("p",{className:"text-gray-400 text-sm mb-3",children:"Scan the QR code to pay using your UPI app."},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:609,columnNumber:21},void 0),e.jsxDEV("div",{className:"flex flex-col gap-3",children:e.jsxDEV("span",{className:"text-gray-300 text-lg font-semibold",children:["Viewer Fee: ",e.jsxDEV("strong",{className:"text-cyan-400 text-2xl",children:["₹",f]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:612,columnNumber:91},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:612,columnNumber:25},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:610,columnNumber:21},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:608,columnNumber:19},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:597,columnNumber:17},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:596,columnNumber:15},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:594,columnNumber:13},void 0),e.jsxDEV("button",{onClick:()=>D(!1),className:"px-4 py-2 rounded-md bg-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/30 transition",children:"Register another"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:620,columnNumber:13},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:515,columnNumber:11},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:514,columnNumber:9},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:513,columnNumber:7},void 0):e.jsxDEV("div",{className:"min-h-screen bg-transparent flex items-center justify-center pt-28 pb-20 md:pb-0",children:e.jsxDEV("div",{className:"max-w-2xl w-full mx-6 animate-fadeInUp",children:e.jsxDEV("div",{className:"bg-[#030712]/80 border border-cyan-500/30 rounded-2xl p-8 md:p-12",children:[e.jsxDEV("div",{className:"mb-6 p-4 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 text-white shadow-md",children:e.jsxDEV("p",{className:"text-center text-sm sm:text-base md:text-lg font-semibold tracking-tight italic leading-tight",children:["This registration is for out-of-college students who are willing to view the events of ",e.jsxDEV("span",{className:"font-extrabold",children:"WINGS 2026"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:638,columnNumber:102},void 0)," at ",e.jsxDEV("span",{className:"font-extrabold",children:"GECCS"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:638,columnNumber:156},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:637,columnNumber:13},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:636,columnNumber:11},void 0),e.jsxDEV("h2",{className:"text-2xl font-bold text-cyan-400 mb-4",children:"Viewer Registration"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:641,columnNumber:11},void 0),e.jsxDEV("p",{className:"text-gray-400 text-sm mb-6",children:"Fill in your details to register as a viewer."},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:642,columnNumber:11},void 0),e.jsxDEV("form",{onSubmit:J,noValidate:!0,children:e.jsxDEV("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxDEV("div",{className:"md:col-span-1",children:[e.jsxDEV("label",{className:"text-gray-400 text-sm mb-1 block",children:"Full Name"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:647,columnNumber:17},void 0),e.jsxDEV("input",{value:g,onChange:i=>N(i.target.value),className:`w-full rounded-lg px-4 py-3 bg-[#020409] border ${a.fullName?"border-red-500":"border-white/20"} text-gray-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/10`,placeholder:"Enter Full Name"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:648,columnNumber:17},void 0),a.fullName&&e.jsxDEV("p",{className:"text-red-500 text-xs mt-1",children:a.fullName},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:654,columnNumber:37},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:646,columnNumber:15},void 0),e.jsxDEV("div",{className:"md:col-span-1",children:[e.jsxDEV("label",{className:"text-gray-400 text-sm mb-1 block",children:"College Name"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:658,columnNumber:17},void 0),e.jsxDEV("input",{value:d,onChange:i=>x(i.target.value),className:`w-full rounded-lg px-4 py-3 bg-[#020409] border ${a.collegeName?"border-red-500":"border-white/20"} text-gray-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/10`,placeholder:"Enter College Name"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:659,columnNumber:17},void 0),a.collegeName&&e.jsxDEV("p",{className:"text-red-500 text-xs mt-1",children:a.collegeName},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:665,columnNumber:40},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:657,columnNumber:15},void 0),e.jsxDEV("div",{className:"md:col-span-2",children:[e.jsxDEV("label",{className:"text-gray-400 text-sm mb-1 block",children:["UTR Number ",e.jsxDEV("span",{className:"text-cyan-400/70",children:"(12 digits)"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:669,columnNumber:80},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:669,columnNumber:17},void 0),e.jsxDEV("input",{value:c,onChange:Q,maxLength:12,inputMode:"numeric",pattern:"[0-9]*",className:`w-full rounded-lg px-4 py-3 bg-[#020409] border ${a.utrNumber?"border-red-500":"border-white/20"} text-gray-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/10`,placeholder:"Enter 12-digit UTR Number"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:670,columnNumber:17},void 0),a.utrNumber&&e.jsxDEV("p",{className:"text-red-500 text-xs mt-1",children:a.utrNumber},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:679,columnNumber:38},void 0),e.jsxDEV("p",{className:"text-gray-500 text-xs mt-1",children:[c.length,"/12 digits"]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:680,columnNumber:17},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:668,columnNumber:15},void 0),e.jsxDEV("div",{className:"md:col-span-2 mt-2",children:e.jsxDEV("div",{className:"mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center",children:[e.jsxDEV("div",{className:"mx-auto",children:[e.jsxDEV("div",{className:"rounded-2xl p-1 bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-transparent shadow-lg",children:e.jsxDEV("div",{className:"bg-[#010214] rounded-xl p-3 flex items-center justify-center",children:e.jsxDEV("div",{className:"bg-white p-2 rounded-md",children:e.jsxDEV(E,{value:C,size:200,level:"H",includeMargin:!0},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:690,columnNumber:27},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:689,columnNumber:25},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:688,columnNumber:23},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:687,columnNumber:21},void 0),e.jsxDEV("p",{className:"text-gray-400 text-xs text-center mt-3",children:"Secure UPI payment — scan to pay"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:699,columnNumber:21},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:686,columnNumber:19},void 0),e.jsxDEV("div",{className:"flex flex-col justify-center gap-3 px-2",children:[e.jsxDEV("p",{className:"text-gray-400 text-sm font-medium",children:"Pay via UPI"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:703,columnNumber:21},void 0),e.jsxDEV("div",{className:"flex flex-col gap-3",children:e.jsxDEV("span",{className:"text-gray-300 text-lg font-semibold",children:["Viewer Fee: ",e.jsxDEV("strong",{className:"text-cyan-400 text-2xl",children:["₹",f]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:706,columnNumber:91},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:706,columnNumber:25},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:704,columnNumber:21},void 0),e.jsxDEV("p",{className:"text-gray-500 text-xs",children:"Tip: After payment, paste the UTR number above to complete verification."},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:709,columnNumber:21},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:702,columnNumber:19},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:685,columnNumber:17},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:684,columnNumber:15},void 0),e.jsxDEV("div",{className:"md:col-span-2 flex justify-end",children:e.jsxDEV("button",{type:"submit",disabled:h,className:"w-full md:w-auto px-5 py-3 rounded-md bg-cyan-400 text-[#031022] font-bold text-sm hover:brightness-95 transition disabled:opacity-60",children:h?"Submitting...":"Submit"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:715,columnNumber:17},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:714,columnNumber:15},void 0),a.submit&&e.jsxDEV("div",{className:"md:col-span-2 p-4 bg-red-900/20 border border-red-500/50 rounded-xl",children:e.jsxDEV("div",{className:"flex items-start gap-3",children:[e.jsxDEV(S,{className:"w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:727,columnNumber:21},void 0),e.jsxDEV("div",{className:"flex-1",children:[e.jsxDEV("h4",{className:"text-red-400 font-semibold text-sm mb-2",children:"Registration Failed"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:729,columnNumber:23},void 0),e.jsxDEV("p",{className:"text-red-300/90 text-sm leading-relaxed",children:a.submit},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:730,columnNumber:23},void 0),e.jsxDEV("p",{className:"text-gray-400 text-xs mt-3",children:"💡 Need help? Contact the Technical Secretary at +91 9175127989"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:731,columnNumber:23},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:728,columnNumber:21},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:726,columnNumber:19},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:725,columnNumber:17},void 0),Object.keys(a).filter(i=>i!=="submit").length>0&&e.jsxDEV("div",{className:"md:col-span-2 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-xl",children:e.jsxDEV("div",{className:"flex items-start gap-3",children:[e.jsxDEV(S,{className:"w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:743,columnNumber:21},void 0),e.jsxDEV("div",{className:"flex-1",children:[e.jsxDEV("h4",{className:"text-yellow-400 font-semibold text-sm mb-2",children:"Please fix the following errors:"},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:745,columnNumber:23},void 0),e.jsxDEV("ul",{className:"text-yellow-300/90 text-sm space-y-1 list-disc list-inside",children:Object.entries(a).filter(([i])=>i!=="submit").map(([i,t])=>e.jsxDEV("li",{children:t},i,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:748,columnNumber:27},void 0))},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:746,columnNumber:23},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:744,columnNumber:21},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:742,columnNumber:19},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:741,columnNumber:17},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:645,columnNumber:13},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:644,columnNumber:11},void 0)]},void 0,!0,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:635,columnNumber:9},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:634,columnNumber:7},void 0)},void 0,!1,{fileName:"C:/Users/victus/Desktop/wings/website/geca-wings-website-2026/pages/ViewerRegistrationPage.tsx",lineNumber:633,columnNumber:5},void 0)};export{ue as default};
