// Servidor estático de desenvolvimento para a UI e módulos ES do projeto MNSR.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
createServer(async(req,res)=>{
 try{
  const url = new URL(req.url,'http://localhost');
  const pathname = decodeURIComponent(url.pathname);
  const path = resolve(root, '.' + (pathname === '/' ? '/public/index.html' : pathname));
  if(!path.startsWith(root.endsWith(sep)?root:root+sep)) {res.writeHead(403);res.end('Proibido');return;}
  const st=await stat(path);
  if(!st.isFile()) throw Error('Not a file');
  const content=await readFile(path);
  res.writeHead(200,{'content-type':types[extname(path)]||'application/octet-stream','cache-control':'no-store'});
  res.end(content);
 }catch(err){res.writeHead(404,{'content-type':'text/plain; charset=utf-8'});res.end('Não encontrado');}
}).listen(port,()=>console.log(`MNSR Digital: http://localhost:${port}`));
