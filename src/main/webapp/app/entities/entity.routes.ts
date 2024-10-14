import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'pivestudoApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'pessoa',
    data: { pageTitle: 'pivestudoApp.pessoa.home.title' },
    loadChildren: () => import('./pessoa/pessoa.routes'),
  },
  {
    path: 'tipo-pessoa',
    data: { pageTitle: 'pivestudoApp.tipoPessoa.home.title' },
    loadChildren: () => import('./tipo-pessoa/tipo-pessoa.routes'),
  },
  {
    path: 'telefone',
    data: { pageTitle: 'pivestudoApp.telefone.home.title' },
    loadChildren: () => import('./telefone/telefone.routes'),
  },
  {
    path: 'documento',
    data: { pageTitle: 'pivestudoApp.documento.home.title' },
    loadChildren: () => import('./documento/documento.routes'),
  },
  {
    path: 'endereco',
    data: { pageTitle: 'pivestudoApp.endereco.home.title' },
    loadChildren: () => import('./endereco/endereco.routes'),
  },
  {
    path: 'lote-bloco-apartamento',
    data: { pageTitle: 'pivestudoApp.loteBlocoApartamento.home.title' },
    loadChildren: () => import('./lote-bloco-apartamento/lote-bloco-apartamento.routes'),
  },
  {
    path: 'automovel',
    data: { pageTitle: 'pivestudoApp.automovel.home.title' },
    loadChildren: () => import('./automovel/automovel.routes'),
  },
  {
    path: 'tipo-automovel',
    data: { pageTitle: 'pivestudoApp.tipoAutomovel.home.title' },
    loadChildren: () => import('./tipo-automovel/tipo-automovel.routes'),
  },
  {
    path: 'autorizacao-acesso',
    data: { pageTitle: 'pivestudoApp.autorizacaoAcesso.home.title' },
    loadChildren: () => import('./autorizacao-acesso/autorizacao-acesso.routes'),
  },
  {
    path: 'estabelecimento',
    data: { pageTitle: 'pivestudoApp.estabelecimento.home.title' },
    loadChildren: () => import('./estabelecimento/estabelecimento.routes'),
  },
  {
    path: 'registro-acesso',
    data: { pageTitle: 'pivestudoApp.registroAcesso.home.title' },
    loadChildren: () => import('./registro-acesso/registro-acesso.routes'),
  },
  {
    path: 'ponto-acesso',
    data: { pageTitle: 'pivestudoApp.pontoAcesso.home.title' },
    loadChildren: () => import('./ponto-acesso/ponto-acesso.routes'),
  },
  {
    path: 'camera',
    data: { pageTitle: 'pivestudoApp.camera.home.title' },
    loadChildren: () => import('./camera/camera.routes'),
  },
  {
    path: 'imagem',
    data: { pageTitle: 'pivestudoApp.imagem.home.title' },
    loadChildren: () => import('./imagem/imagem.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
