import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  Car,
  ChevronRight,
  ImagePlus,
  Loader2,
  MoreHorizontal,
  Pencil,
  Search,
  ShieldAlert,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'my_garage_pages_v1';
const blankVehicle = {
  name: '',
  category: 'car',
  brand: '',
  model: '',
  year: '',
  plate: '',
  vin: '',
  owner: '',
  phone: '',
  insuranceExpiry: '',
  inspectionExpiry: '',
  lastMaintenanceDate: '',
  lastMaintenanceMileage: '',
  nextMaintenanceDate: '',
  nextMaintenanceMileage: '',
  maintenanceNote: '',
  verified: false,
  favorite: false,
  vehicleImage: '',
  brandLogo: '',
  notes: '',
};

const seedVehicles = [
  {
    ...blankVehicle,
    id: crypto.randomUUID(),
    name: '保时捷 911',
    category: 'car',
    brand: 'Porsche',
    model: 'Carrera Cabriolet 3.0T',
    year: '2022',
    plate: '苏AW***0',
    vin: 'WP0CA2998NS112233',
    owner: '陈先生',
    phone: '13800138000',
    insuranceExpiry: nextDate(18),
    inspectionExpiry: nextDate(76),
    lastMaintenanceDate: '2026-02-16',
    lastMaintenanceMileage: '11800',
    nextMaintenanceDate: '2026-08-16',
    nextMaintenanceMileage: '16800',
    maintenanceNote: '下次检查刹车片和软顶机构。',
    verified: false,
    favorite: true,
    brandLogo: logoSvg('POR', '#f4d16e', '#241b12'),
    vehicleImage: carSvg('#233f8d', '#141b2a'),
    notes: '常用车，周末出行使用。',
  },
  {
    ...blankVehicle,
    id: crypto.randomUUID(),
    name: '奔驰 G 级 AMG',
    category: 'car',
    brand: 'Mercedes-Benz',
    model: 'AMG G 63',
    year: '2023',
    plate: '苏AS***5',
    vin: 'W1NYC7HJ6PX445566',
    owner: '林女士',
    phone: '13988886666',
    insuranceExpiry: nextDate(42),
    inspectionExpiry: nextDate(12),
    lastMaintenanceDate: '2026-01-09',
    lastMaintenanceMileage: '32100',
    nextMaintenanceDate: '2026-07-09',
    nextMaintenanceMileage: '37100',
    maintenanceNote: '年检前同步检查轮胎与底盘。',
    verified: true,
    favorite: false,
    brandLogo: logoSvg('MB', '#eef3f8', '#17202c'),
    vehicleImage: carSvg('#eef2f5', '#182538'),
    notes: '年检快到期，优先安排。',
  },
  {
    ...blankVehicle,
    id: crypto.randomUUID(),
    name: '杜卡迪 Panigale',
    category: 'motorcycle',
    brand: 'Ducati',
    model: 'V4 S',
    year: '2024',
    plate: '沪C D***9',
    vin: 'ZDMFAKWW8RB778899',
    owner: '周先生',
    phone: '13777778888',
    insuranceExpiry: nextDate(95),
    inspectionExpiry: nextDate(210),
    lastMaintenanceDate: '2026-03-22',
    lastMaintenanceMileage: '4200',
    nextMaintenanceDate: '2026-09-22',
    nextMaintenanceMileage: '7200',
    maintenanceNote: '链条清洁后补油。',
    verified: true,
    favorite: true,
    brandLogo: logoSvg('DU', '#e84b3c', '#fff3f0'),
    vehicleImage: motorcycleSvg('#d2362b'),
    notes: '摩托车位 A-07。',
  },
];

function App() {
  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).map((vehicle) => normalizeVehicle(vehicle)) : seedVehicles;
    } catch {
      return seedVehicles;
    }
  });
  const [activeTab, setActiveTab] = useState('car');
  const [query, setQuery] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [draft, setDraft] = useState(blankVehicle);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    } catch (error) {
      console.error('LocalStorage 保存失败，可能是图片数据过大。', error);
      alert('图片数据过大，浏览器本地存储空间不足。请换一张更小的图片后再试。');
    }
  }, [vehicles]);

  const visibleVehicles = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return vehicles
      .filter((vehicle) => vehicle.category === activeTab)
      .filter((vehicle) => {
        if (!keyword) return true;
        return [
          vehicle.name,
          vehicle.brand,
          vehicle.model,
          vehicle.year,
          vehicle.plate,
          vehicle.vin,
          vehicle.owner,
          vehicle.phone,
        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword);
      });
  }, [activeTab, query, vehicles]);

  function openCreate() {
    setDraft({ ...blankVehicle, category: activeTab });
    setModalMode('create');
  }

  function openEdit(vehicle) {
    setDraft(normalizeVehicle(vehicle));
    setModalMode('edit');
  }

  function saveVehicle(event) {
    event.preventDefault();
    const payload = normalizeVehicle(draft);
    if (modalMode === 'edit') {
      setVehicles((current) => current.map((vehicle) => (vehicle.id === payload.id ? payload : vehicle)));
      setDetail(payload);
    } else {
      const created = { ...payload, id: crypto.randomUUID() };
      setVehicles((current) => [created, ...current]);
      setActiveTab(created.category);
      setDetail(created);
    }
    setModalMode(null);
  }

  function removeVehicle(vehicle) {
    if (!confirm(`确认删除「${vehicle.name || vehicle.brand || '未命名车辆'}」？`)) return;
    setVehicles((current) => current.filter((item) => item.id !== vehicle.id));
    setDetail(null);
    setModalMode(null);
  }

  return (
    <main className="min-h-screen bg-[#030812] text-white">
      <div className="garage-shell mx-auto min-h-screen max-w-[480px] pb-32 shadow-[0_0_70px_rgba(0,0,0,.55)]">
        <header className="sticky top-0 z-20 bg-gradient-to-b from-[#06101f]/96 via-[#06101f]/88 to-[#06101f]/58 px-5 pb-5 pt-5 backdrop-blur-2xl">
          <div className="mb-5 flex justify-center">
            <BrandLogo compact />
          </div>
          <div className="grid grid-cols-[40px_1fr_40px] items-center">
            <button className="icon-line-button grid h-10 w-10 place-items-center rounded-full text-white/90" aria-label="返回">
              <ArrowLeft size={34} strokeWidth={2.2} />
            </button>
            <h1 className="title-emboss text-center text-[34px] font-semibold tracking-wide">车库档案</h1>
            <button className="icon-line-button grid h-10 w-10 place-items-center rounded-full text-white/72" aria-label="更多">
              <MoreHorizontal size={25} />
            </button>
          </div>
          <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
          <label className="glass-search mt-6 flex h-12 items-center gap-3 rounded-2xl px-4 text-white/62">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索车辆名称、车牌、VIN"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-white/38"
            />
          </label>
        </header>

        <section className="space-y-5 px-4 pt-2">
          {visibleVehicles.length ? (
            visibleVehicles.map((vehicle, index) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} onOpen={() => setDetail(vehicle)} onEdit={() => openEdit(vehicle)} />
            ))
          ) : (
            <EmptyGarage activeTab={activeTab} onCreate={openCreate} />
          )}
        </section>

        <BottomDock onCreate={openCreate} />
      </div>

      {modalMode && (
        <VehicleForm
          draft={draft}
          setDraft={setDraft}
          onClose={() => setModalMode(null)}
          onSave={saveVehicle}
          onDelete={modalMode === 'edit' ? () => removeVehicle(draft) : null}
        />
      )}

      {detail && <VehicleDetail vehicle={detail} onClose={() => setDetail(null)} onEdit={() => openEdit(detail)} />}
    </main>
  );
}

function TabBar({ activeTab, setActiveTab }) {
  const tabs = [
    ['car', '汽车'],
    ['motorcycle', '摩托车'],
  ];
  return (
    <nav className="mt-8 flex gap-8">
      {tabs.map(([key, label]) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`relative pb-2 text-[25px] font-semibold transition active:scale-95 ${activeTab === key ? 'text-white drop-shadow-[0_0_14px_rgba(104,216,255,.25)]' : 'text-white/52'}`}
        >
          {label}
          {activeTab === key && <span className="absolute bottom-0 left-0 h-1 w-11 rounded-full bg-[linear-gradient(90deg,#65dcff,#1688ff)] shadow-[0_0_16px_rgba(22,136,255,.95)]" />}
        </button>
      ))}
    </nav>
  );
}

function VehicleCard({ vehicle, index, onOpen, onEdit }) {
  const alerts = dueAlerts(vehicle);
  const hasPhoto = Boolean(vehicle.vehicleImage);
  return (
    <article
      onClick={onOpen}
      style={{ animationDelay: `${index * 70}ms` }}
      className="garage-card card-enter relative min-h-[188px] overflow-hidden rounded-[22px] p-4 transition duration-300 active:scale-[.985]"
    >
      {hasPhoto && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-75"
          style={{ backgroundImage: `url(${vehicle.vehicleImage})` }}
        />
      )}
      <div className={`absolute inset-0 ${hasPhoto ? 'bg-[linear-gradient(90deg,rgba(5,12,22,.94)_0%,rgba(5,12,22,.76)_46%,rgba(5,12,22,.36)_100%),linear-gradient(180deg,rgba(5,12,22,.2)_0%,rgba(3,8,18,.9)_100%)]' : ''}`} />
      {vehicle.verified && (
        <div className="absolute left-0 top-0 rounded-br-[14px] border-b border-r border-cyanGlow/25 bg-cyanGlow/15 px-3 py-1 text-[12px] font-semibold text-cyanGlow shadow-[0_0_18px_rgba(104,216,255,.16)]">Lv.2 认证车</div>
      )}
      <div className="pointer-events-none absolute -right-2 top-2 text-[76px] font-black italic leading-none tracking-[-.04em] text-white/[.045]">G-VAULT</div>
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-cyanGlow/45 to-transparent" />
      <button
        onClick={(event) => {
          event.stopPropagation();
          onEdit();
        }}
        className="icon-line-button absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full text-cyanGlow/85"
        aria-label="编辑车辆"
      >
        <Pencil size={15} />
      </button>

      <div className="relative z-10 max-w-[64%] pt-3">
        <div className="flex items-center gap-3">
          <LogoImage src={vehicle.brandLogo} label={vehicle.brand} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-[22px] font-semibold tracking-wide text-[#f0f6ff] drop-shadow-[0_0_14px_rgba(104,216,255,.12)]">{vehicle.name || '未命名车辆'}</h2>
              {vehicle.favorite && (
                <span className="shrink-0 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-2 py-0.5 text-[11px] text-cyanGlow">常用车</span>
              )}
            </div>
          </div>
        </div>

        <p className="mt-3 truncate text-[15px] text-white/62">
          {vehicle.year ? `${vehicle.year} 款 ` : ''}
          {vehicle.model || '未填写型号'}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Tag>{vehicle.plate || '未登记车牌'}</Tag>
          <Tag>{vehicle.verified ? '已认证' : '申请认证'} <ChevronRight className="inline" size={13} /></Tag>
          {alerts.map((alert) => (
            <AlertTag key={alert}>{alert}</AlertTag>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 right-0 flex h-[108px] w-[50%] items-end justify-end pr-2">
        {hasPhoto ? (
          <img src={vehicle.vehicleImage} alt={vehicle.name} className="vehicle-float max-h-full max-w-full object-contain opacity-90 drop-shadow-[0_22px_22px_rgba(0,0,0,.42)]" />
        ) : (
          <DefaultVehicle type={vehicle.category} />
        )}
      </div>
    </article>
  );
}

function LogoImage({ src, label }) {
  return (
    <div className="grid h-[40px] w-[40px] shrink-0 place-items-center overflow-hidden rounded-full border border-white/20 bg-white/90 text-xs font-bold text-slate-700 shadow-[0_0_18px_rgba(104,216,255,.14)]">
      {src ? <img src={src} alt={`${label || '品牌'} Logo`} className="h-full w-full object-cover" /> : <Car size={24} />}
    </div>
  );
}

function Tag({ children }) {
  return <span className="rounded-md border border-white/8 bg-white/[.075] px-2 py-0.5 text-[12px] text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]">{children}</span>;
}

function AlertTag({ children }) {
  return <span className="rounded-md border border-[#ffca74]/20 bg-[#ffb34d]/16 px-2 py-0.5 text-[12px] text-[#ffd28b] shadow-[0_0_14px_rgba(255,179,77,.14)]">{children}</span>;
}

function BottomDock({ onCreate }) {
  return (
    <footer className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 bg-gradient-to-t from-[#040b16] via-[#040b16]/88 to-transparent px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-8">
      <button
        onClick={onCreate}
        className="tech-add-button mx-auto block h-[62px] w-full rounded-[22px] text-[21px] font-semibold text-white transition active:scale-[.965] active:brightness-110"
      >
        添加车辆
      </button>
    </footer>
  );
}

function BrandLogo({ compact = false }) {
  return (
    <div className={`garage-pill inline-flex items-center gap-2 rounded-full border border-cyanGlow/45 bg-[linear-gradient(135deg,rgba(38,169,255,.95),rgba(11,96,255,.82))] ${compact ? 'px-4 py-1.5' : 'px-5 py-2'}`}>
      <svg className="h-5 w-5 drop-shadow-[0_0_10px_rgba(104,216,255,.55)]" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 3 27 8v8.5c0 6.5-4.6 10.5-11 12.5C9.6 27 5 23 5 16.5V8z" fill="rgba(3,12,25,.52)" stroke="rgba(210,244,255,.95)" strokeWidth="1.8" />
        <path d="M9.5 14 16 8.7 22.5 14v8.2h-4.1v-4.7h-4.8v4.7H9.5z" fill="none" stroke="rgba(104,216,255,.95)" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M11.2 13.6 16 22.4l4.8-8.8" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".82" />
      </svg>
      <span className="text-xs font-black tracking-[.24em] text-white">G-VAULT</span>
    </div>
  );
}

function VehicleForm({ draft, setDraft, onClose, onSave, onDelete }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#020711]/82 backdrop-blur-xl">
      <form onSubmit={onSave} className="panel-slide-up garage-panel h-[96vh] w-full max-w-[480px] overflow-y-auto rounded-t-[28px] p-5 text-white shadow-2xl">
        <div className="sticky top-0 z-10 -mx-5 -mt-5 mb-5 flex items-center justify-between border-b border-white/8 bg-[#081424]/88 px-5 py-5 backdrop-blur-2xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.26em] text-cyanGlow/80">G-VAULT Command</p>
            <h2 className="mt-1 text-[28px] font-semibold drop-shadow-[0_0_18px_rgba(104,216,255,.12)]">{draft.id ? '编辑车辆档案' : '添加车辆档案'}</h2>
          </div>
          <button type="button" onClick={onClose} className="icon-line-button grid h-11 w-11 place-items-center rounded-full text-white/75">
            <X size={22} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SegmentButton active={draft.category === 'car'} onClick={() => setDraftValue(setDraft, 'category', 'car')}>汽车</SegmentButton>
          <SegmentButton active={draft.category === 'motorcycle'} onClick={() => setDraftValue(setDraft, 'category', 'motorcycle')}>摩托车</SegmentButton>
        </div>

        <div className="mt-5 grid gap-3">
          <ImagePicker large label="车辆照片" value={draft.vehicleImage} onChange={(value) => setDraftValue(setDraft, 'vehicleImage', value)} />
          <ImagePicker label="品牌 Logo" value={draft.brandLogo} onChange={(value) => setDraftValue(setDraft, 'brandLogo', value)} />
        </div>

        <div className="mt-5 grid gap-4">
          <FormSectionTitle>基本信息</FormSectionTitle>
          <Input label="车辆名称" value={draft.name} required onChange={(value) => setDraftValue(setDraft, 'name', value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="品牌" value={draft.brand} onChange={(value) => setDraftValue(setDraft, 'brand', value)} />
            <Input label="型号" value={draft.model} onChange={(value) => setDraftValue(setDraft, 'model', value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="年款" value={draft.year} inputMode="numeric" onChange={(value) => setDraftValue(setDraft, 'year', value)} />
            <Input label="车牌号" value={draft.plate} onChange={(value) => setDraftValue(setDraft, 'plate', value)} />
          </div>
          <Input label="VIN 车架号" value={draft.vin} onChange={(value) => setDraftValue(setDraft, 'vin', value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="车主姓名" value={draft.owner} onChange={(value) => setDraftValue(setDraft, 'owner', value)} />
            <Input label="联系电话" value={draft.phone} type="tel" onChange={(value) => setDraftValue(setDraft, 'phone', value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="保险到期日" value={draft.insuranceExpiry} type="date" onChange={(value) => setDraftValue(setDraft, 'insuranceExpiry', value)} />
            <Input label="年检到期日" value={draft.inspectionExpiry} type="date" onChange={(value) => setDraftValue(setDraft, 'inspectionExpiry', value)} />
          </div>
          <FormSectionTitle>保养信息</FormSectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <Input label="上次保养时间" value={draft.lastMaintenanceDate} type="date" onChange={(value) => setDraftValue(setDraft, 'lastMaintenanceDate', value)} />
            <Input label="上次保养公里数" value={draft.lastMaintenanceMileage} inputMode="numeric" onChange={(value) => setDraftValue(setDraft, 'lastMaintenanceMileage', value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="下次保养时间" value={draft.nextMaintenanceDate} type="date" onChange={(value) => setDraftValue(setDraft, 'nextMaintenanceDate', value)} />
            <Input label="下次保养公里数" value={draft.nextMaintenanceMileage} inputMode="numeric" onChange={(value) => setDraftValue(setDraft, 'nextMaintenanceMileage', value)} />
          </div>
          <label className="block">
            <span className="text-sm text-white/62">保养备注</span>
            <textarea
              value={draft.maintenanceNote}
              onChange={(event) => setDraftValue(setDraft, 'maintenanceNote', event.target.value)}
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[.07] px-4 py-3 text-[16px] leading-6 outline-none transition focus:border-electric focus:bg-white/[.09]"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Toggle active={draft.verified} onClick={() => setDraftValue(setDraft, 'verified', !draft.verified)} icon={<BadgeCheck size={18} />}>认证状态</Toggle>
            <Toggle active={draft.favorite} onClick={() => setDraftValue(setDraft, 'favorite', !draft.favorite)} icon={<Star size={18} />}>常用车</Toggle>
          </div>
          <label className="block">
            <span className="text-sm text-white/62">备注</span>
            <textarea
              value={draft.notes}
              onChange={(event) => setDraftValue(setDraft, 'notes', event.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[.07] px-4 py-3 text-[16px] leading-6 outline-none transition focus:border-electric focus:bg-white/[.09]"
            />
          </label>
        </div>

        <div className="sticky bottom-0 -mx-5 mt-7 flex gap-3 border-t border-cyanGlow/10 bg-[#081424]/92 px-5 pb-1 pt-4 backdrop-blur-2xl">
          {onDelete && (
            <button type="button" onClick={onDelete} className="icon-line-button grid h-12 w-12 place-items-center rounded-xl border-red-400/30 text-red-200">
              <Trash2 size={20} />
            </button>
          )}
          <button type="button" onClick={onClose} className="h-[52px] rounded-2xl border border-white/10 px-5 text-[16px] text-white/70 transition active:scale-[.97] active:bg-white/[.06]">取消</button>
          <button type="submit" className="tech-add-button h-[52px] flex-1 rounded-2xl text-lg font-semibold transition active:scale-[.975]">保存档案</button>
        </div>
      </form>
    </div>
  );
}

function VehicleDetail({ vehicle, onClose, onEdit }) {
  const basicItems = [
    ['品牌', vehicle.brand],
    ['型号', vehicle.model],
    ['年款', vehicle.year],
    ['车牌号', vehicle.plate],
    ['VIN 车架号', vehicle.vin],
    ['车主姓名', vehicle.owner],
    ['联系电话', vehicle.phone],
    ['认证状态', vehicle.verified ? '已认证' : '未认证'],
    ['是否常用车', vehicle.favorite ? '是' : '否'],
  ];
  const expiryItems = [
    ['保险到期日', vehicle.insuranceExpiry, expiryLabel(vehicle.insuranceExpiry)],
    ['年检到期日', vehicle.inspectionExpiry, expiryLabel(vehicle.inspectionExpiry)],
  ];
  const maintenanceItems = [
    ['上次保养时间', vehicle.lastMaintenanceDate],
    ['上次保养公里数', formatMileage(vehicle.lastMaintenanceMileage)],
    ['下次保养时间', vehicle.nextMaintenanceDate],
    ['下次保养公里数', formatMileage(vehicle.nextMaintenanceMileage)],
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#020711]/82 backdrop-blur-xl">
      <section className="panel-slide-up garage-panel max-h-[94vh] w-full max-w-[480px] overflow-y-auto rounded-t-[28px] p-5 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.24em] text-cyanGlow/75">G-VAULT Archive</p>
            <h2 className="mt-1 text-[28px] font-semibold drop-shadow-[0_0_18px_rgba(104,216,255,.12)]">{vehicle.name}</h2>
          </div>
          <button onClick={onClose} className="icon-line-button grid h-11 w-11 place-items-center rounded-full">
            <X size={22} />
          </button>
        </div>
        <div className="archive-hero mt-5 overflow-hidden rounded-[24px] p-4">
          <div className="flex items-center gap-3">
            <LogoImage src={vehicle.brandLogo} label={vehicle.brand} />
            <div>
              <div className="text-lg font-semibold">{vehicle.year} 款 {vehicle.model}</div>
              <div className="text-white/55">{vehicle.category === 'car' ? '汽车' : '摩托车'}</div>
            </div>
          </div>
          <div className="relative mt-4 h-52">
            <div className="absolute inset-x-5 bottom-4 h-8 rounded-full bg-black/35 blur-xl" />
            {vehicle.vehicleImage ? <img src={vehicle.vehicleImage} alt={vehicle.name} className="relative h-full w-full object-contain drop-shadow-[0_26px_24px_rgba(0,0,0,.45)]" /> : <DefaultVehicle type={vehicle.category} />}
          </div>
        </div>
        <DetailSection title="基本信息" items={basicItems} />
        <section className="mt-5 rounded-2xl border border-cyanGlow/12 bg-white/[.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05)]">
          <SectionTitle icon={<ShieldAlert size={17} />}>保险与年检</SectionTitle>
          <div className="mt-4 grid gap-3">
            {expiryItems.map(([label, value, state]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-white/8 pb-3 text-[15px] last:border-b-0 last:pb-0">
                <span className="text-white/50">{label}</span>
                <span className="flex flex-col items-end gap-1 text-right">
                  <span className="text-white/88">{value || '未填写'}</span>
                  {value && <span className={`glow-status rounded-full px-2.5 py-1 text-xs ${state.tone}`}>{state.text}</span>}
                </span>
              </div>
            ))}
          </div>
        </section>
        <DetailSection title="保养信息" items={maintenanceItems} />
        <div className="mt-5 rounded-2xl border border-cyanGlow/12 bg-white/[.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05)]">
          <SectionTitle>保养备注</SectionTitle>
          <p className="mt-3 whitespace-pre-wrap text-[15px] leading-6 text-white/86">{vehicle.maintenanceNote || '暂无保养备注'}</p>
        </div>
        <div className="mt-5 rounded-2xl border border-cyanGlow/12 bg-white/[.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05)]">
          <SectionTitle>备注</SectionTitle>
          <p className="mt-2 whitespace-pre-wrap text-white/86">{vehicle.notes || '暂无备注'}</p>
        </div>
        <button onClick={onEdit} className="tech-add-button mt-5 h-12 w-full rounded-2xl text-lg font-semibold transition active:scale-[.975]">编辑车辆</button>
      </section>
    </div>
  );
}

function ImagePicker({ label, value, onChange, large = false }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    setError('');
    try {
      const base64 = await compressImageToBase64(file);
      onChange(base64);
    } catch (uploadError) {
      console.error(uploadError);
      setError('图片处理失败，请换一张图片');
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  }

  return (
    <label className={`upload-card relative grid cursor-pointer place-items-center overflow-hidden rounded-3xl ${large ? 'h-52' : 'h-32'}`}>
      {value ? (
        <img src={value} alt={label} className={`h-full w-full ${large ? 'object-contain p-3' : 'object-cover'}`} />
      ) : (
        <span className="flex flex-col items-center gap-2 text-white/55">
          <ImagePlus size={24} />
          <span className="text-sm">{label}</span>
          <span className="px-3 text-center text-[11px] leading-4 text-white/36">
            {large ? '建议上传车辆侧前方照片，效果最佳' : '自动压缩保存'}
          </span>
        </span>
      )}
      {isProcessing && (
        <span className="absolute inset-0 grid place-items-center bg-[#071326]/75 text-white">
          <Loader2 className="animate-spin" size={26} />
        </span>
      )}
      {error && <span className="absolute bottom-2 left-2 right-12 rounded bg-red-500/80 px-2 py-1 text-xs text-white">{error}</span>}
      <span className="absolute bottom-3 right-3 rounded-full border border-cyanGlow/25 bg-black/45 p-2 text-cyanGlow shadow-[0_0_14px_rgba(104,216,255,.16)]">
        <Upload size={16} />
      </span>
      <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </label>
  );
}

function FormSectionTitle({ children }) {
  return <h3 className="pt-1 text-sm font-semibold uppercase tracking-[.16em] text-white/42">{children}</h3>;
}

function DetailSection({ title, items }) {
  return (
    <section className="mt-5 rounded-xl border border-white/10 bg-white/[.045] p-4">
      <SectionTitle>{title}</SectionTitle>
      <div className="mt-4 grid gap-3">
        {items.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-white/8 pb-3 text-[15px] last:border-b-0 last:pb-0">
            <span className="text-white/50">{label}</span>
            <span className="max-w-[66%] break-words text-right text-white/88">{value || '未填写'}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ children, icon }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[.14em] text-white/50">
      {icon}
      <span>{children}</span>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', required, inputMode }) {
  return (
    <label className="block">
      <span className="text-sm text-white/62">{label}</span>
      <input
        type={type}
        required={required}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[.07] px-4 text-[16px] outline-none transition placeholder:text-white/30 focus:border-electric focus:bg-white/[.09]"
      />
    </label>
  );
}

function SegmentButton({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} className={`h-11 rounded-lg text-[16px] font-semibold ${active ? 'bg-electric text-white' : 'bg-white/[.07] text-white/65'}`}>
      {children}
    </button>
  );
}

function Toggle({ active, onClick, icon, children }) {
  return (
    <button type="button" onClick={onClick} className={`flex h-12 items-center justify-center gap-2 rounded-lg border text-[15px] ${active ? 'border-electric bg-electric/18 text-white' : 'border-white/10 bg-white/[.05] text-white/55'}`}>
      {icon}
      {children}
    </button>
  );
}

function EmptyGarage({ activeTab, onCreate }) {
  return (
    <div className="mt-12 rounded-[12px] border border-dashed border-white/15 bg-white/[.04] p-8 text-center">
      <Camera className="mx-auto text-white/38" size={38} />
      <h2 className="mt-4 text-xl font-semibold">暂无{activeTab === 'car' ? '汽车' : '摩托车'}</h2>
      <p className="mt-2 text-sm text-white/45">添加车辆后，会显示在你的车库列表中。</p>
      <button onClick={onCreate} className="mt-5 h-11 rounded-lg bg-electric px-7 font-semibold">添加车辆</button>
    </div>
  );
}

function DefaultVehicle({ type }) {
  return (
    <div className="grid h-full w-full place-items-center text-white/35">
      {type === 'motorcycle' ? (
        <svg viewBox="0 0 320 150" className="h-full w-full">
          <circle cx="82" cy="108" r="31" fill="none" stroke="currentColor" strokeWidth="12" />
          <circle cx="242" cy="108" r="31" fill="none" stroke="currentColor" strokeWidth="12" />
          <path d="M92 103h46l31-43h34l34 43h-68l-49-58" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M198 62h41l21 21" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 360 170" className="h-full w-full">
          <path d="M42 107c10-30 31-48 62-52l38-27h98l52 45c16 3 28 13 35 34v30H42z" fill="currentColor" opacity=".45" />
          <circle cx="103" cy="135" r="24" fill="#101b2b" stroke="currentColor" strokeWidth="10" />
          <circle cx="270" cy="135" r="24" fill="#101b2b" stroke="currentColor" strokeWidth="10" />
          <path d="M147 39h80l37 33H105z" fill="#d9ecff" opacity=".2" />
        </svg>
      )}
    </div>
  );
}

function normalizeVehicle(vehicle) {
  return {
    ...blankVehicle,
    ...vehicle,
    name: (vehicle.name || '').trim(),
    brand: (vehicle.brand || '').trim(),
    model: (vehicle.model || '').trim(),
    year: (vehicle.year || '').trim(),
    plate: (vehicle.plate || '').trim(),
    vin: (vehicle.vin || '').trim(),
    owner: (vehicle.owner || '').trim(),
    phone: (vehicle.phone || '').trim(),
    lastMaintenanceDate: vehicle.lastMaintenanceDate || '',
    lastMaintenanceMileage: (vehicle.lastMaintenanceMileage || '').trim(),
    nextMaintenanceDate: vehicle.nextMaintenanceDate || '',
    nextMaintenanceMileage: (vehicle.nextMaintenanceMileage || '').trim(),
    maintenanceNote: (vehicle.maintenanceNote || '').trim(),
    notes: (vehicle.notes || '').trim(),
  };
}

function setDraftValue(setDraft, key, value) {
  setDraft((current) => ({ ...current, [key]: value }));
}

function compressImageToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('请选择图片文件'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxWidth = 1200;
        const scale = Math.min(1, maxWidth / image.width);
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.fillStyle = '#101b2b';
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      image.onerror = () => reject(new Error('图片无法读取'));
      image.src = reader.result;
    };
    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.readAsDataURL(file);
  });
}

function expiryLabel(dateString) {
  const days = daysUntil(dateString);
  if (days === null) return { text: '', tone: '' };
  if (days < 0) return { text: `已逾期 ${Math.abs(days)} 天`, tone: 'bg-red-500/20 text-red-200' };
  if (days <= 30) return { text: `${days} 天后到期`, tone: 'bg-[#ffb34d]/20 text-[#ffd28b]' };
  return { text: `${days} 天后到期`, tone: 'bg-emerald-400/15 text-emerald-200' };
}

function formatMileage(value) {
  if (!value) return '';
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toLocaleString()} km` : `${value} km`;
}

function dueAlerts(vehicle) {
  const alerts = [];
  const insuranceDays = daysUntil(vehicle.insuranceExpiry);
  const inspectionDays = daysUntil(vehicle.inspectionExpiry);
  if (insuranceDays !== null && insuranceDays <= 30) alerts.push(insuranceDays < 0 ? '保险已过期' : '保险快到期');
  if (inspectionDays !== null && inspectionDays <= 30) alerts.push(inspectionDays < 0 ? '年检已过期' : '年检快到期');
  return alerts;
}

function daysUntil(dateString) {
  if (!dateString) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateString}T00:00:00`);
  return Math.ceil((target - today) / 86400000);
}

function nextDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function logoSvg(text, bg, fg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
      <rect width="80" height="80" rx="40" fill="${bg}"/>
      <circle cx="40" cy="40" r="31" fill="none" stroke="${fg}" stroke-width="5" opacity=".55"/>
      <text x="40" y="47" text-anchor="middle" font-family="Arial" font-size="22" font-weight="800" fill="${fg}">${text}</text>
    </svg>
  `)}`;
}

function carSvg(color, shadow) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 250">
      <ellipse cx="276" cy="211" rx="196" ry="24" fill="${shadow}" opacity=".45"/>
      <path d="M72 166c15-43 50-67 105-72l62-45h122l77 68c31 5 51 22 59 49l-16 35H86z" fill="${color}"/>
      <path d="M239 61h109l59 53H166z" fill="#dbe9ff" opacity=".42"/>
      <path d="M85 163h406l-10 38H86z" fill="#0d1627" opacity=".22"/>
      <circle cx="166" cy="200" r="35" fill="#111827"/>
      <circle cx="166" cy="200" r="21" fill="#8794a7"/>
      <circle cx="399" cy="200" r="35" fill="#111827"/>
      <circle cx="399" cy="200" r="21" fill="#8794a7"/>
      <path d="M73 164h70" stroke="#edf7ff" stroke-width="10" stroke-linecap="round" opacity=".7"/>
      <path d="M444 151h42" stroke="#fff1bd" stroke-width="10" stroke-linecap="round"/>
    </svg>
  `)}`;
}

function motorcycleSvg(color) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 230">
      <ellipse cx="270" cy="198" rx="190" ry="20" fill="#111827" opacity=".38"/>
      <circle cx="144" cy="174" r="43" fill="#111827"/>
      <circle cx="144" cy="174" r="27" fill="#8c96a6"/>
      <circle cx="367" cy="174" r="43" fill="#111827"/>
      <circle cx="367" cy="174" r="27" fill="#8c96a6"/>
      <path d="M148 157h78l47-62h65l49 62h-98l-70-82" fill="none" stroke="${color}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M248 93h69l-21 44h-83z" fill="${color}"/>
      <path d="M329 92h59l35 35" fill="none" stroke="#d9e8ff" stroke-width="13" stroke-linecap="round"/>
    </svg>
  `)}`;
}

createRoot(document.getElementById('root')).render(<App />);
