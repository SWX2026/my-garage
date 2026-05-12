import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  Car,
  ChevronRight,
  Headphones,
  ImagePlus,
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
      return saved ? JSON.parse(saved) : seedVehicles;
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
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
    setDraft({ ...vehicle });
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
    <main className="min-h-screen bg-night text-white">
      <div className="mx-auto min-h-screen max-w-[480px] bg-[linear-gradient(180deg,#071326_0%,#101927_44%,#0b1628_100%)] pb-28 shadow-2xl">
        <StatusBar />
        <header className="sticky top-0 z-20 bg-gradient-to-b from-[#071326] via-[#071326]/96 to-[#071326]/86 px-5 pb-4 pt-5 backdrop-blur">
          <div className="grid grid-cols-[40px_1fr_40px] items-center">
            <button className="grid h-10 w-10 place-items-center rounded-full text-white/95 active:bg-white/10" aria-label="返回">
              <ArrowLeft size={34} strokeWidth={2.2} />
            </button>
            <h1 className="text-center text-[30px] font-semibold tracking-wide">我的车库</h1>
            <button className="grid h-10 w-10 place-items-center rounded-full text-white/70 active:bg-white/10" aria-label="更多">
              <MoreHorizontal size={25} />
            </button>
          </div>
          <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
          <label className="mt-5 flex h-11 items-center gap-3 rounded-full border border-white/8 bg-white/[.055] px-4 text-white/55">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索车辆名称、车牌、VIN"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-white/38"
            />
          </label>
        </header>

        <section className="space-y-4 px-4 pt-2">
          {visibleVehicles.length ? (
            visibleVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} onOpen={() => setDetail(vehicle)} onEdit={() => openEdit(vehicle)} />
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

function StatusBar() {
  return (
    <div className="flex h-11 items-center justify-between px-9 pt-2 text-[16px] font-semibold text-white/95">
      <span>13:55</span>
      <span className="rounded-full bg-electric px-4 py-1 text-xs font-bold shadow-[0_0_18px_rgba(22,136,255,.42)]">GARAGE</span>
      <span className="flex items-center gap-1">
        <span className="h-3 w-1 rounded bg-white/70" />
        <span className="h-4 w-1 rounded bg-white/80" />
        <span className="h-5 w-1 rounded bg-white" />
        <span className="ml-2 h-4 w-7 rounded border-2 border-white/80" />
      </span>
    </div>
  );
}

function TabBar({ activeTab, setActiveTab }) {
  const tabs = [
    ['car', '汽车'],
    ['motorcycle', '摩托车'],
  ];
  return (
    <nav className="mt-7 flex gap-8">
      {tabs.map(([key, label]) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`relative pb-2 text-[25px] font-semibold ${activeTab === key ? 'text-white' : 'text-white/66'}`}
        >
          {label}
          {activeTab === key && <span className="absolute bottom-0 left-0 h-1 w-10 rounded-full bg-electric shadow-[0_0_12px_rgba(22,136,255,.9)]" />}
        </button>
      ))}
    </nav>
  );
}

function VehicleCard({ vehicle, onOpen, onEdit }) {
  const alerts = dueAlerts(vehicle);
  return (
    <article
      onClick={onOpen}
      className="relative min-h-[216px] overflow-hidden rounded-[10px] border border-[#33465e] bg-[linear-gradient(100deg,#2a3443_0%,#293241_54%,#202b3a_100%)] p-5 shadow-card active:scale-[.99]"
    >
      {vehicle.verified && (
        <div className="absolute left-0 top-0 rounded-br-[10px] bg-[#eaf0ff] px-3 py-1 text-[13px] font-semibold text-[#34415d]">Lv.2 认证车</div>
      )}
      <div className="pointer-events-none absolute right-10 top-1 text-[120px] font-black italic leading-none text-white/[.025]">AUTO</div>
      <button
        onClick={(event) => {
          event.stopPropagation();
          onEdit();
        }}
        className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full text-white/70 active:bg-white/10"
        aria-label="编辑车辆"
      >
        <Pencil size={22} />
      </button>

      <div className="relative z-10 max-w-[62%] pt-3">
        <div className="flex items-center gap-3">
          <LogoImage src={vehicle.brandLogo} label={vehicle.brand} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-[27px] font-semibold tracking-wide text-[#edf2ff]">{vehicle.name || '未命名车辆'}</h2>
              {vehicle.favorite && (
                <span className="shrink-0 rounded bg-white/10 px-2 py-1 text-[13px] text-white/85">常用车</span>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 truncate text-[19px] text-white/57">
          {vehicle.year ? `${vehicle.year} 款 ` : ''}
          {vehicle.model || '未填写型号'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Tag>{vehicle.plate || '未登记车牌'}</Tag>
          <Tag>{vehicle.verified ? '已认证' : '申请认证'} <ChevronRight className="inline" size={13} /></Tag>
          {alerts.map((alert) => (
            <AlertTag key={alert}>{alert}</AlertTag>
          ))}
        </div>
      </div>

      <div className="absolute bottom-5 right-3 flex h-[120px] w-[58%] items-end justify-end">
        {vehicle.vehicleImage ? (
          <img src={vehicle.vehicleImage} alt={vehicle.name} className="max-h-full max-w-full object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,.35)]" />
        ) : (
          <DefaultVehicle type={vehicle.category} />
        )}
      </div>
    </article>
  );
}

function LogoImage({ src, label }) {
  return (
    <div className="grid h-[44px] w-[44px] shrink-0 place-items-center overflow-hidden rounded-full bg-white text-xs font-bold text-slate-700">
      {src ? <img src={src} alt={`${label || '品牌'} Logo`} className="h-full w-full object-cover" /> : <Car size={24} />}
    </div>
  );
}

function Tag({ children }) {
  return <span className="rounded bg-white/[.09] px-2.5 py-1 text-[15px] text-white/66">{children}</span>;
}

function AlertTag({ children }) {
  return <span className="rounded bg-[#ffb34d]/20 px-2.5 py-1 text-[15px] text-[#ffd28b]">{children}</span>;
}

function BottomDock({ onCreate }) {
  return (
    <footer className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-[480px] -translate-x-1/2 grid-cols-[82px_1fr] border-t border-white/5 bg-[#071326]/96 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-2 shadow-dock backdrop-blur">
      <button className="flex flex-col items-center justify-center gap-1 text-white">
        <Headphones size={32} />
        <span className="text-[14px]">客服</span>
      </button>
      <button
        onClick={onCreate}
        className="h-[58px] rounded-[4px] bg-electric text-[22px] font-semibold text-white shadow-[0_8px_26px_rgba(22,136,255,.34)] active:scale-[.99]"
      >
        添加车辆
      </button>
    </footer>
  );
}

function VehicleForm({ draft, setDraft, onClose, onSave, onDelete }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
      <form onSubmit={onSave} className="max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-t-[22px] border border-white/10 bg-[#101b2b] p-5 text-white shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{draft.id ? '编辑车辆' : '添加车辆'}</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/8">
            <X size={22} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SegmentButton active={draft.category === 'car'} onClick={() => setDraftValue(setDraft, 'category', 'car')}>汽车</SegmentButton>
          <SegmentButton active={draft.category === 'motorcycle'} onClick={() => setDraftValue(setDraft, 'category', 'motorcycle')}>摩托车</SegmentButton>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <ImagePicker label="车辆图片" value={draft.vehicleImage} onChange={(value) => setDraftValue(setDraft, 'vehicleImage', value)} />
          <ImagePicker label="品牌 Logo" value={draft.brandLogo} onChange={(value) => setDraftValue(setDraft, 'brandLogo', value)} />
        </div>

        <div className="mt-5 grid gap-4">
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
          <div className="grid grid-cols-2 gap-3">
            <Toggle active={draft.verified} onClick={() => setDraftValue(setDraft, 'verified', !draft.verified)} icon={<BadgeCheck size={18} />}>认证状态</Toggle>
            <Toggle active={draft.favorite} onClick={() => setDraftValue(setDraft, 'favorite', !draft.favorite)} icon={<Star size={18} />}>常用车</Toggle>
          </div>
          <label className="block">
            <span className="text-sm text-white/55">备注</span>
            <textarea
              value={draft.notes}
              onChange={(event) => setDraftValue(setDraft, 'notes', event.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/[.06] px-3 py-3 text-[16px] outline-none focus:border-electric"
            />
          </label>
        </div>

        <div className="sticky bottom-0 mt-6 flex gap-3 bg-[#101b2b] pb-1 pt-4">
          {onDelete && (
            <button type="button" onClick={onDelete} className="grid h-12 w-12 place-items-center rounded-lg border border-red-400/30 text-red-200">
              <Trash2 size={20} />
            </button>
          )}
          <button type="submit" className="h-12 flex-1 rounded-lg bg-electric text-lg font-semibold">保存</button>
        </div>
      </form>
    </div>
  );
}

function VehicleDetail({ vehicle, onClose, onEdit }) {
  const items = [
    ['品牌', vehicle.brand],
    ['型号', vehicle.model],
    ['年款', vehicle.year],
    ['车牌号', vehicle.plate],
    ['VIN 车架号', vehicle.vin],
    ['车主姓名', vehicle.owner],
    ['联系电话', vehicle.phone],
    ['保险到期日', vehicle.insuranceExpiry],
    ['年检到期日', vehicle.inspectionExpiry],
    ['认证状态', vehicle.verified ? '已认证' : '未认证'],
    ['是否常用车', vehicle.favorite ? '是' : '否'],
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 backdrop-blur-sm">
      <section className="max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-t-[22px] border border-white/10 bg-[#101b2b] p-5 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{vehicle.name}</h2>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/8">
            <X size={22} />
          </button>
        </div>
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[.04] p-4">
          <div className="flex items-center gap-3">
            <LogoImage src={vehicle.brandLogo} label={vehicle.brand} />
            <div>
              <div className="text-lg font-semibold">{vehicle.year} 款 {vehicle.model}</div>
              <div className="text-white/55">{vehicle.category === 'car' ? '汽车' : '摩托车'}</div>
            </div>
          </div>
          <div className="mt-4 h-40">
            {vehicle.vehicleImage ? <img src={vehicle.vehicleImage} alt={vehicle.name} className="h-full w-full object-contain" /> : <DefaultVehicle type={vehicle.category} />}
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {items.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-white/8 pb-3 text-[15px]">
              <span className="text-white/50">{label}</span>
              <span className="max-w-[66%] break-words text-right text-white/88">{value || '未填写'}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg bg-white/[.05] p-4">
          <div className="text-sm text-white/50">备注</div>
          <p className="mt-2 whitespace-pre-wrap text-white/86">{vehicle.notes || '暂无备注'}</p>
        </div>
        <button onClick={onEdit} className="mt-5 h-12 w-full rounded-lg bg-electric text-lg font-semibold">编辑车辆</button>
      </section>
    </div>
  );
}

function ImagePicker({ label, value, onChange }) {
  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    onChange(base64);
  }

  return (
    <label className="relative grid h-32 cursor-pointer place-items-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-white/[.045]">
      {value ? (
        <img src={value} alt={label} className="h-full w-full object-cover" />
      ) : (
        <span className="flex flex-col items-center gap-2 text-white/55">
          <ImagePlus size={24} />
          <span className="text-sm">{label}</span>
        </span>
      )}
      <span className="absolute bottom-2 right-2 rounded-full bg-black/45 p-2">
        <Upload size={16} />
      </span>
      <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </label>
  );
}

function Input({ label, value, onChange, type = 'text', required, inputMode }) {
  return (
    <label className="block">
      <span className="text-sm text-white/55">{label}</span>
      <input
        type={type}
        required={required}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-white/[.06] px-3 text-[16px] outline-none focus:border-electric"
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
    name: vehicle.name.trim(),
    brand: vehicle.brand.trim(),
    model: vehicle.model.trim(),
    year: vehicle.year.trim(),
    plate: vehicle.plate.trim(),
    vin: vehicle.vin.trim(),
    owner: vehicle.owner.trim(),
    phone: vehicle.phone.trim(),
    notes: vehicle.notes.trim(),
  };
}

function setDraftValue(setDraft, key, value) {
  setDraft((current) => ({ ...current, [key]: value }));
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
