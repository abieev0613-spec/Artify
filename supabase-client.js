/* Artify: browser-only Supabase integration (GitHub Pages compatible). */
(() => {
  const ready = () => window.supabase && window.ARTIFY_SUPABASE_URL && !window.ARTIFY_SUPABASE_URL.includes('YOUR_PROJECT_ID') && window.ARTIFY_SUPABASE_ANON_KEY && !window.ARTIFY_SUPABASE_ANON_KEY.includes('YOUR_SUPABASE');
  if (!ready()) { console.warn('Artify Supabase setup required: edit supabase-config.js'); return; }
  const sb = window.supabase.createClient(window.ARTIFY_SUPABASE_URL, window.ARTIFY_SUPABASE_ANON_KEY, { auth: { autoRefreshToken:true, persistSession:true, detectSessionInUrl:true } });
  window.artifySupabase = sb;
  window.artifySaveLocalState = async (cart,wishlist)=>{const {data:{user}}=await sb.auth.getUser();if(!user)return;const q=await sb.from('artify_user_data').update({cart:cart||[],wishlist:wishlist||[],updated_at:new Date().toISOString()}).eq('user_id',user.id);if(q.error)console.error('Could not sync cart/wishlist:',q.error.message);};
  const originalFetch = window.fetch.bind(window);
  const json = (body, status=200) => Promise.resolve(new Response(JSON.stringify(body), {status,headers:{'Content-Type':'application/json'}}));
  const err = (message,status=400) => json({success:false,error:message},status);
  const uid = async () => { const {data:{user}} = await sb.auth.getUser(); return user; };
  async function row(user) {
    let {data,error} = await sb.from('artify_user_data').select('*').eq('user_id',user.id).maybeSingle();
    if (error) throw error;
    if (!data) { const fresh={user_id:user.id,profile:{name:user.user_metadata?.name||'',email:user.email||'',phone:user.user_metadata?.phone||'',address:user.user_metadata?.address||''},custom_art:[],orders:[],cart:[],wishlist:[]};
      const ins=await sb.from('artify_user_data').insert(fresh).select().single(); if(ins.error) throw ins.error; data=ins.data; }
    return data;
  }
  async function save(user, changes) { const r=await sb.from('artify_user_data').update({...changes,updated_at:new Date().toISOString()}).eq('user_id',user.id); if(r.error) throw r.error; }
  window.fetch = async function(input, init={}) {
    const url = typeof input==='string' ? input : input.url;
    if (!url || !url.startsWith('/api/')) return originalFetch(input,init);
    try {
      const method=(init.method||'GET').toUpperCase(); const body=init.body?JSON.parse(init.body):{}; const path=url.split('?')[0];
      if(path==='/api/products' || path.startsWith('/api/products/')) { const list=window.products||[]; return json({success:true,products:list,count:list.length,product:list.find(p=>String(p.id)===path.split('/').pop())}); }
      if(path==='/api/register' && method==='POST') { const {data,error}=await sb.auth.signUp({email:body.email,password:body.password,options:{emailRedirectTo:location.origin+location.pathname.replace(/[^/]*$/,'')+'login.html',data:{name:body.name||'',phone:body.phone||'',address:body.address||''}}}); if(error)return err(error.message); return json({success:true,needsVerification:true,email:body.email,message:'Confirmation link sent. Please check your email and confirm your account before logging in.'},201); }
      if(path==='/api/login' && method==='POST') { const email=body.identifier||body.email; if(!String(email||'').includes('@')) return err('Please log in using your email address.'); const {data,error}=await sb.auth.signInWithPassword({email,password:body.password}); if(error)return err(error.message,401); if(!data.user.email_confirmed_at){await sb.auth.signOut();return err('Please confirm your email before logging in.',401);} const d=await row(data.user); return json({success:true,user:{id:data.user.id,...d.profile,email:data.user.email}}); }
      if(path==='/api/verify-email' || path==='/api/resend-verification') return err('Use the confirmation link sent by Supabase to your email.');
      const user=await uid(); if(!user)return err('Please log in to continue.',401); const d=await row(user); const me={id:user.id,...d.profile,email:user.email};
      if(path===`/api/users/${user.id}` && method==='GET') return json({success:true,user:me});
      if(path.startsWith('/api/users/') && method==='GET' && path.endsWith('/orders')) return json({success:true,orders:d.orders||[]});
      if(path===`/api/users/${user.id}` && method==='PUT') { const profile={...d.profile,...body}; await save(user,{profile}); return json({success:true,user:{...me,...body}}); }
      if(path==='/api/orders' && method==='POST') { const order={...body,id:'AF'+Date.now().toString().slice(-8),userId:user.id,status:'Placed',createdAt:new Date().toISOString()}; const orders=[...(d.orders||[]),order]; await save(user,{orders}); return json({success:true,order},201); }
      if(path.startsWith('/api/orders/') && method==='GET') { const id=path.split('/')[3]; const order=(d.orders||[]).find(o=>String(o.id)===id); return order?json({success:true,order}):err('Order not found',404); }
      if(path.startsWith('/api/orders/') && method==='PATCH') { const id=path.split('/')[3]; const orders=(d.orders||[]).map(o=>String(o.id)===id?{...o,...body}:o); await save(user,{orders}); return json({success:true,orders}); }
      if(path.startsWith('/api/track/')) { const id=path.split('/').pop(); const order=(d.orders||[]).find(o=>String(o.id)===id); return order?json({...order,created_at:order.createdAt,payment_method:order.paymentMethod}):err('Order not found',404); }
      if(path.startsWith('/api/custom-art')) { const parts=path.split('/'); if(method==='GET')return json({success:true,requests:d.custom_art||[]}); if(method==='POST'){const request={...body,id:Date.now(),userId:user.id,createdAt:new Date().toISOString()};const requests=[...(d.custom_art||[]),request];await save(user,{custom_art:requests});return json({success:true,request},201);} if(method==='DELETE'){const requests=(d.custom_art||[]).filter(x=>String(x.id)!==parts[3]);await save(user,{custom_art:requests});return json({success:true});} if(method==='PUT'){const requests=(d.custom_art||[]).map(x=>String(x.id)===parts[3]?{...x,...body}:x);await save(user,{custom_art:requests});return json({success:true,requests});} }
      return err('This feature is not available in the browser-only Supabase build yet.',501);
    } catch(e) { console.error('Artify Supabase:',e); return err(e.message||'Supabase request failed.',500); }
  };
  sb.auth.getSession().then(async ({data:{session}})=>{ if(session?.user){try{const d=await row(session.user);window.currentUser={id:session.user.id,...d.profile,email:session.user.email};localStorage.setItem('artify_user',JSON.stringify(window.currentUser));localStorage.setItem('artify_cart',JSON.stringify(d.cart||[]));localStorage.setItem('artify_wishlist',JSON.stringify(d.wishlist||[]));}catch(e){console.error(e);}} });
  sb.auth.onAuthStateChange(async (event,session)=>{ if(event==='SIGNED_OUT'){localStorage.removeItem('artify_user');window.currentUser=null;} });
})();
