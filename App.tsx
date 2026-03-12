import React, { useState, useMemo, useEffect } from 'react';
import { DiscountType, PaymentMethod, SktPlan, SktDevice, CalculatorState, DeviceCategory } from './types';

// [시스템 안내] 아래 DEFAULT 데이터는 관리자 모드에서 추출한 최신 데이터를 기반으로 동기화되었습니다.
const STORAGE_KEY_DEVICES = 'skt_opt_devices_v4';
const STORAGE_KEY_PLANS = 'skt_opt_plans_v4';

// [시스템 수정] 관리자 시크릿 이미지 & 비밀번호
const SECRET_IMAGE_URL = 'https://i.postimg.cc/LXTM0WcZ/20260215.png'; 
const SECRET_PASSWORD = '6091'; 

// [시스템 수정] Tally 폼 주소 연결 (대표님이 만드신 주소 적용 완료)
const CONSULT_FORM_URL = 'https://tally.so/r/0Q64kA'; 
const PURCHASE_FORM_URL = 'https://tally.so/r/aQYWkZ'; 

const DEFAULT_DEVICES: SktDevice[] = [
  { id: 'dev-1767915504591', name: '갤럭시 Z 폴드7 (256GB)', price: 2379300, category: 'foldable', order: 1 },
  { id: 'dev-1767915493279', name: '갤럭시 Z 폴드7 (512GB)', price: 2537700, category: 'foldable', order: 2 },
  { id: 'dev-1767915524863', name: '갤럭시 Z 플립7 (256GB)', price: 1485000, category: 'foldable', order: 3 },
  { id: 'dev-1767915570366', name: '갤럭시 Z 플립7 (512GB)', price: 1643400, category: 'foldable', order: 4 },
  { id: 'dev-1767916109151', name: '갤럭시 S25 FE (256GB)', price: 946000, category: 's-series', order: 10 },
  { id: 's25-base', name: '갤럭시 S25 (256GB)', price: 1155000, category: 's-series', order: 11 },
  { id: 'dev-1767915712564', name: '갤럭시 S25 (512GB)', price: 1298000, category: 's-series', order: 12 },
  { id: 's25-plus', name: '갤럭시 S25 플러스 (256GB)', price: 1353000, category: 's-series', order: 13 },
  { id: 'dev-1767915766460', name: '갤럭시 S25 플러스 (512GB)', price: 1474000, category: 's-series', order: 14 },
  { id: 'dev-1767916003353', name: '갤럭시 S25 울트라 (256GB)', price: 1698400, category: 's-series', order: 15 },
  { id: 's25-ultra', name: '갤럭시 S25 울트라 (512GB)', price: 1841400, category: 's-series', order: 16 },
  { id: 'dev-1767917169762', name: '갤럭시 S25 엣지 (256GB)', price: 1496000, category: 's-series', order: 17 },
  { id: 'dev-1767917190001', name: '갤럭시 S25 엣지 (512GB)', price: 1639000, category: 's-series', order: 18 },
  { id: 'dev-1767916167575', name: '갤럭시 퀀텀6', price: 618200, category: 'a-series', order: 21 },
  { id: 'dev-1767916206734', name: '갤럭시 와이드8 (128GB)', price: 374000, category: 'a-series', order: 23 },
  { id: 'dev-1767916247917', name: '갤럭시 A17 LTE (128GB)', price: 319000, category: 'a-series', order: 26 },
  { id: 'dev-1767915429280', name: 'iPhone 17 (256GB)', price: 1287000, category: 'apple', order: 71 },
  { id: 'dev-1767915442264', name: 'iPhone 17 (512GB)', price: 1584000, category: 'apple', order: 72 },
  { id: 'dev-1767915389512', name: 'iPhone Air (256GB)', price: 1584000, category: 'apple', order: 73 },
  { id: 'dev-1767915359969', name: 'iPhone Air (512GB)', price: 1881000, category: 'apple', order: 74 },
  { id: 'dev-1767915340737', name: 'iPhone 17 Pro (256GB)', price: 1782000, category: 'apple', order: 75 },
  { id: 'dev-1767915327593', name: 'iPhone 17 Pro (512GB)', price: 2090000, category: 'apple', order: 76 },
  { id: 'dev-1767915303673', name: 'iPhone 17 ProMax (256GB)', price: 1980000, category: 'apple', order: 79 },
  { id: 'dev-1767915282122', name: 'iPhone 17 ProMax (512GB)', price: 2288000, category: 'apple', order: 80 },
];

const DEFAULT_PLANS: SktPlan[] = [
  { id: '5gx-premium', name: '5GX 프리미엄', price: 109000, subsidy: { 's25-ultra': 500000, 's25-plus': 500000, 's25-base': 500000, 'dev-1767915282122': 220000, 'dev-1767915303673': 220000, 'dev-1767915327593': 450000, 'dev-1767915340737': 450000, 'dev-1767915359969': 450000, 'dev-1767915389512': 450000, 'dev-1767915429280': 450000, 'dev-1767915442264': 450000, 'dev-1767915493279': 500000, 'dev-1767915504591': 500000, 'dev-1767915524863': 600000, 'dev-1767915570366': 600000, 'dev-1767915712564': 500000, 'dev-1767915766460': 500000, 'dev-1767916003353': 500000, 'dev-1767916109151': 530000, 'dev-1767916167575': 357000, 'dev-1767916206734': 293400, 'dev-1767916247917': 130000, 'dev-1767917169762': 600000, 'dev-1767917190001': 600000 } },
  { id: '5gx-prime-plus', name: '5GX 프라임플러스', price: 99000, subsidy: { 's25-ultra': 490000, 's25-plus': 490000, 's25-base': 490000, 'dev-1767915282122': 180000, 'dev-1767915303673': 180000, 'dev-1767915327593': 430000, 'dev-1767915340737': 430000, 'dev-1767915359969': 430000, 'dev-1767915389512': 430000, 'dev-1767915429280': 430000, 'dev-1767915442264': 430000, 'dev-1767915493279': 490000, 'dev-1767915504591': 490000, 'dev-1767915524863': 590000, 'dev-1767915570366': 590000, 'dev-1767915712564': 490000, 'dev-1767915766460': 490000, 'dev-1767916003353': 490000, 'dev-1767916109151': 500000, 'dev-1767916167575': 340000, 'dev-1767916206734': 293400, 'dev-1767916247917': 130000, 'dev-1767917169762': 590000, 'dev-1767917190001': 590000 } },
  { id: '5gx-prime', name: '5GX 프라임', price: 89000, subsidy: { 's25-ultra': 480000, 's25-plus': 480000, 's25-base': 480000, 'dev-1767915282122': 150000, 'dev-1767915303673': 150000, 'dev-1767915327593': 420000, 'dev-1767915340737': 420000, 'dev-1767915359969': 420000, 'dev-1767915389512': 420000, 'dev-1767915429280': 420000, 'dev-1767915442264': 420000, 'dev-1767915493279': 480000, 'dev-1767915504591': 480000, 'dev-1767915524863': 580000, 'dev-1767915570366': 580000, 'dev-1767915712564': 480000, 'dev-1767915766460': 480000, 'dev-1767916003353': 480000, 'dev-1767916109151': 480000, 'dev-1767916167575': 320000, 'dev-1767916206734': 293400, 'dev-1767916247917': 130000, 'dev-1767917169762': 580000, 'dev-1767917190001': 580000 } },
  { id: 'plan-1767916389004', name: '5GX 레귤러플러스', price: 79000, subsidy: { 's25-ultra': 453000, 's25-plus': 453000, 's25-base': 453000, 'dev-1767915282122': 135000, 'dev-1767915303673': 135000, 'dev-1767915327593': 393000, 'dev-1767915340737': 393000, 'dev-1767915359969': 393000, 'dev-1767915389512': 393000, 'dev-1767915429280': 393000, 'dev-1767915442264': 393000, 'dev-1767915493279': 453000, 'dev-1767915504591': 453000, 'dev-1767915524863': 553000, 'dev-1767915570366': 553000, 'dev-1767915712564': 453000, 'dev-1767915766460': 453000, 'dev-1767916003353': 453000, 'dev-1767916109151': 425000, 'dev-1767916167575': 283000, 'dev-1767916206734': 293400, 'dev-1767916247917': 98000, 'dev-1767917169762': 553000, 'dev-1767917190001': 553000 } },
  { id: '5gx-regular', name: '5GX 레귤러', price: 69000, subsidy: { 's25-ultra': 420000, 's25-plus': 420000, 's25-base': 420000, 'dev-1767915282122': 118000, 'dev-1767915303673': 118000, 'dev-1767915327593': 360000, 'dev-1767915340737': 360000, 'dev-1767915359969': 360000, 'dev-1767915389512': 360000, 'dev-1767915429280': 360000, 'dev-1767915442264': 360000, 'dev-1767915493279': 420000, 'dev-1767915504591': 420000, 'dev-1767915524863': 520000, 'dev-1767915570366': 520000, 'dev-1767915712564': 420000, 'dev-1767915766460': 420000, 'dev-1767916003353': 420000, 'dev-1767916109151': 355000, 'dev-1767916167575': 248000, 'dev-1767916206734': 293400, 'dev-1767916247917': 98000, 'dev-1767917169762': 520000, 'dev-1767917190001': 520000 } },
  { id: 'plan-1767916423859', name: '5GX 베이직플러스', price: 59000, subsidy: { 's25-ultra': 395000, 's25-plus': 395000, 's25-base': 395000, 'dev-1767915282122': 112000, 'dev-1767915303673': 112000, 'dev-1767915327593': 335000, 'dev-1767915340737': 335000, 'dev-1767915359969': 335000, 'dev-1767915389512': 335000, 'dev-1767915429280': 335000, 'dev-1767915442264': 335000, 'dev-1767915493279': 395000, 'dev-1767915504591': 395000, 'dev-1767915524863': 495000, 'dev-1767915570366': 495000, 'dev-1767915712564': 395000, 'dev-1767915766460': 395000, 'dev-1767916003353': 395000, 'dev-1767916109151': 336000, 'dev-1767916167575': 239000, 'dev-1767916206734': 293400, 'dev-1767916247917': 98000, 'dev-1767917169762': 495000, 'dev-1767917190001': 495000 } },
  { id: '5gx-slim', name: '5GX 슬림', price: 55000, subsidy: { 's25-ultra': 370000, 's25-plus': 370000, 's25-base': 370000, 'dev-1767915282122': 107000, 'dev-1767915303673': 107000, 'dev-1767915327593': 310000, 'dev-1767915340737': 310000, 'dev-1767915359969': 310000, 'dev-1767915389512': 310000, 'dev-1767915429280': 310000, 'dev-1767915442264': 310000, 'dev-1767915493279': 370000, 'dev-1767915504591': 370000, 'dev-1767915524863': 470000, 'dev-1767915570366': 470000, 'dev-1767915712564': 370000, 'dev-1767915766460': 370000, 'dev-1767916003353': 370000, 'dev-1767916109151': 316000, 'dev-1767916167575': 230000, 'dev-1767916206734': 293400, 'dev-1767916247917': 98000, 'dev-1767917169762': 470000, 'dev-1767917190001': 470000 } },
  { id: 'plan-1767916466435', name: '5GX 베이직', price: 49000, subsidy: { 's25-ultra': 333000, 's25-plus': 333000, 's25-base': 333000, 'dev-1767915282122': 100000, 'dev-1767915303673': 100000, 'dev-1767915327593': 273000, 'dev-1767915340737': 273000, 'dev-1767915359969': 273000, 'dev-1767915389512': 273000, 'dev-1767915429280': 273000, 'dev-1767915442264': 273000, 'dev-1767915493279': 333000, 'dev-1767915504591': 333000, 'dev-1767915524863': 433000, 'dev-1767915570366': 433000, 'dev-1767915712564': 333000, 'dev-1767915766460': 333000, 'dev-1767916003353': 333000, 'dev-1767916109151': 287000, 'dev-1767916167575': 215000, 'dev-1767916206734': 293400, 'dev-1767916247917': 98000, 'dev-1767917169762': 433000, 'dev-1767917190001': 433000 } },
  { id: 'plan-1767916494610', name: '5GX 컴팩트플러스', price: 45000, subsidy: { 's25-ultra': 315000, 's25-plus': 315000, 's25-base': 315000, 'dev-1767915282122': 88000, 'dev-1767915303673': 88000, 'dev-1767915327593': 255000, 'dev-1767915340737': 255000, 'dev-1767915359969': 255000, 'dev-1767915389512': 255000, 'dev-1767915429280': 255000, 'dev-1767915442264': 255000, 'dev-1767915493279': 310000, 'dev-1767915504591': 310000, 'dev-1767915524863': 410000, 'dev-1767915570366': 410000, 'dev-1767915712564': 315000, 'dev-1767915766460': 315000, 'dev-1767916003353': 315000, 'dev-1767916109151': 265000, 'dev-1767916167575': 195000, 'dev-1767916206734': 293400, 'dev-1767916247917': 98000, 'dev-1767917169762': 415000, 'dev-1767917190001': 415000 } },
  { id: 'plan-1767916505570', name: '0틴5G', price: 45000, subsidy: { 's25-ultra': 315000, 's25-plus': 315000, 's25-base': 315000, 'dev-1767915282122': 88000, 'dev-1767915303673': 88000, 'dev-1767915327593': 255000, 'dev-1767915340737': 255000, 'dev-1767915359969': 255000, 'dev-1767915389512': 255000, 'dev-1767915429280': 255000, 'dev-1767915442264': 255000, 'dev-1767915493279': 310000, 'dev-1767915504591': 310000, 'dev-1767915524863': 410000, 'dev-1767915570366': 410000, 'dev-1767915712564': 315000, 'dev-1767915766460': 315000, 'dev-1767916003353': 315000, 'dev-1767916109151': 265000, 'dev-1767916167575': 195000, 'dev-1767916206734': 293400, 'dev-1767916247917': 98000, 'dev-1767917169762': 415000, 'dev-1767917190001': 415000 } },
  { id: 'plan-1767916528994', name: '5GX 컴팩트', price: 39000, subsidy: { 'dev-1767916206734': 285000, 'dev-1767916247917': 88000 } },
  { id: 'plan-1767916543506', name: 'T플랜세이브', price: 33000, subsidy: { 'dev-1767916206734': 270000, 'dev-1767916247917': 88000 } },
  { id: 'plan-1767916558442', name: 'Zem플랜베스트', price: 26000, subsidy: { 'dev-1767916206734': 270000, 'dev-1767916247917': 88000 } },
  { id: 'plan-1767916567289', name: 'Zem플랜스마트', price: 19800, subsidy: { 'dev-1767916206734': 270000, 'dev-1767916247917': 88000, 'dev-1767917169762': 224000, 'dev-1767917190001': 245000 } },
];

const CATEGORIES = [
  { id: 'foldable', name: '폴더블', icon: 'fa-mobile-v' },
  { id: 's-series', name: '갤럭시 S', icon: 'fa-bolt' },
  { id: 'a-series', name: '갤럭시 A', icon: 'fa-wallet' },
  { id: 'apple', name: '애플', icon: 'fa-apple' }
];

const App: React.FC = () => {
  const [devices, setDevices] = useState<SktDevice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DEVICES);
    return saved ? JSON.parse(saved) : DEFAULT_DEVICES;
  });
  const [plans, setPlans] = useState<SktPlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PLANS);
    return saved ? JSON.parse(saved) : DEFAULT_PLANS;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');

  // [시스템 수정] 시크릿/폼 모달 관련 State
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [secretPw, setSecretPw] = useState('');
  const [isSecretUnlocked, setIsSecretUnlocked] = useState(false);
  
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const [userCategory, setUserCategory] = useState<DeviceCategory>('s-series');

  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDevicePrice, setNewDevicePrice] = useState<number | ''>('');
  const [newDeviceOrder, setNewDeviceOrder] = useState<number | ''>('');
  const [newDeviceCategory, setNewDeviceCategory] = useState<DeviceCategory>('s-series');
  const [autoCalculateSubsidy, setAutoCalculateSubsidy] = useState(true);
  
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState<number | ''>('');
  const [showExportModal, setShowExportModal] = useState(false);

  const sortedDevices = useMemo(() => {
    return [...devices].sort((a, b) => (a.order || 999) - (b.order || 999));
  }, [devices]);

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => b.price - a.price);
  }, [plans]);

  const filteredDevicesForUser = useMemo(() => {
    return sortedDevices.filter(d => d.category === userCategory);
  }, [sortedDevices, userCategory]);

  const [state, setState] = useState<CalculatorState>({
    deviceId: sortedDevices.find(d => d.category === 's-series')?.id || sortedDevices[0]?.id || '',
    initialPlanId: sortedPlans[0]?.id || '',
    afterPlanId: sortedPlans[sortedPlans.length - 1]?.id || '',
    discountType: DiscountType.CONTRACT,
    paymentMethod: PaymentMethod.INSTALLMENT,
    employeeDiscount: 0,
    useFamilyDiscount: false,
    internetDiscount: 0,
    maintenanceMonths: 4,
  });

  const handleCategoryChange = (cat: DeviceCategory) => {
    setUserCategory(cat);
    const firstDeviceInCat = sortedDevices.find(d => d.category === cat);
    if (firstDeviceInCat) {
      setState(prev => ({ ...prev, deviceId: firstDeviceInCat.id }));
    }
  };

  useEffect(() => {
    const months = state.discountType === DiscountType.SUBSIDY ? 6 : 4;
    setState(prev => ({ ...prev, maintenanceMonths: months }));
  }, [state.discountType]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DEVICES, JSON.stringify(devices));
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
  }, [devices, plans]);

  const formatKrw = (val: number) => new Intl.NumberFormat('ko-KR').format(val) + '원';

  const selectedDevice = useMemo(() => devices.find(d => d.id === state.deviceId) || sortedDevices[0], [devices, sortedDevices, state.deviceId]);
  const initialPlan = useMemo(() => plans.find(p => p.id === state.initialPlanId) || sortedPlans[0], [plans, sortedPlans, state.initialPlanId]);
  const afterPlan = useMemo(() => plans.find(p => p.id === state.afterPlanId) || sortedPlans[sortedPlans.length - 1], [plans, sortedPlans, state.afterPlanId]);

  const results = useMemo(() => {
    if (!selectedDevice || !initialPlan || !afterPlan) return null;
    const subsidy = state.discountType === DiscountType.SUBSIDY ? (initialPlan.subsidy[selectedDevice.id] || 0) : 0;
    const principal = Math.max(0, selectedDevice.price - subsidy - state.employeeDiscount);
    let monthlyInstallment = 0;
    let totalInterest = 0;
    if (state.paymentMethod === PaymentMethod.INSTALLMENT && principal > 0) {
      const r = 0.059 / 12;
      const n = 24;
      monthlyInstallment = Math.floor(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      totalInterest = (monthlyInstallment * n) - principal;
    }
    const calcFee = (plan: SktPlan) => {
      const contractDiscount = state.discountType === DiscountType.CONTRACT ? Math.floor(plan.price * 0.25) : 0;
      const familyDiscount = state.useFamilyDiscount ? Math.floor(plan.price * 0.30) : 0;
      const finalFee = Math.max(0, plan.price - contractDiscount - familyDiscount - state.internetDiscount);
      return { finalFee, contractDiscount, familyDiscount, internetDiscount: state.internetDiscount };
    };
    const initialFeeData = calcFee(initialPlan);
    const afterFeeData = calcFee(afterPlan);
    const m1 = initialFeeData.finalFee + monthlyInstallment;
    const m2 = afterFeeData.finalFee + monthlyInstallment;
    const maintenance = state.maintenanceMonths;
    const remaining = 24 - maintenance;
    let total2Year = (m1 * maintenance) + (m2 * remaining);
    if (state.paymentMethod === PaymentMethod.LUMP_SUM) {
      total2Year = principal + (initialFeeData.finalFee * maintenance) + (afterFeeData.finalFee * remaining);
    }
    return { principal, subsidy, monthlyInstallment, totalInterest, initial: { ...initialFeeData, total: m1 }, after: { ...afterFeeData, total: m2 }, total2Year };
  }, [state, selectedDevice, initialPlan, afterPlan]);

  const estimateSubsidy = (devicePrice: number, planPrice: number): number => {
    let ratio = 0;
    if (planPrice >= 120000) ratio = 0.32;
    else if (planPrice >= 89000) ratio = 0.28;
    else if (planPrice >= 69000) ratio = 0.22;
    else ratio = 0.15;
    let estimated = Math.floor((devicePrice * ratio) / 1000) * 1000;
    const maxSubsidy = devicePrice > 1500000 ? 600000 : 500000;
    return Math.min(estimated, maxSubsidy);
  };

  const addDevice = () => {
    if (newDeviceName && typeof newDevicePrice === 'number') {
      const deviceId = `dev-${Date.now()}`;
      const order = typeof newDeviceOrder === 'number' ? newDeviceOrder : devices.length + 1;
      const newDevice: SktDevice = { id: deviceId, name: newDeviceName, price: newDevicePrice, category: newDeviceCategory, order };
      if (autoCalculateSubsidy) {
        const updatedPlans = plans.map(p => ({
          ...p,
          subsidy: { ...p.subsidy, [deviceId]: estimateSubsidy(newDevicePrice, p.price) }
        }));
        setPlans(updatedPlans);
      }
      setDevices([...devices, newDevice]);
      setNewDeviceName(''); setNewDevicePrice(''); setNewDeviceOrder('');
    }
  };

  const addPlan = () => {
    if (newPlanName && typeof newPlanPrice === 'number') {
      const newSubsidy: Record<string, number> = {};
      devices.forEach(d => { newSubsidy[d.id] = estimateSubsidy(d.price, newPlanPrice as number); });
      setPlans([...plans, { id: `plan-${Date.now()}`, name: newPlanName, price: newPlanPrice, subsidy: newSubsidy }]);
      setNewPlanName(''); setNewPlanPrice('');
    }
  };

  const formatAsCode = (data: any[], type: 'SktDevice' | 'SktPlan') => {
    const lines = data.map(item => {
      const entries = Object.entries(item).map(([key, value]) => {
        let formattedValue = value;
        if (typeof value === 'string') { formattedValue = `'${value}'`; }
        else if (typeof value === 'object' && value !== null) {
          const innerEntries = Object.entries(value).map(([k, v]) => `'${k}': ${v}`);
          formattedValue = `{ ${innerEntries.join(', ')} }`;
        }
        return `${key}: ${formattedValue}`;
      });
      return `  { ${entries.join(', ')} },`;
    });
    return `const DEFAULT_${type === 'SktDevice' ? 'DEVICES' : 'PLANS'}: ${type}[] = [\n${lines.join('\n')}\n];`;
  };

  const getExportCode = () => `${formatAsCode(devices, 'SktDevice')}\n\n${formatAsCode(plans, 'SktPlan')}`;
  
  const handleManualSave = () => {
    localStorage.setItem(STORAGE_KEY_DEVICES, JSON.stringify(devices));
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
    alert('✅ 데이터가 브라우저에 안전하게 저장되었습니다.\n\n[알림] 소스 코드에도 반영하려면 [시스템 데이터 추출] 기능을 이용하세요.');
  };

  const copyToClipboard = () => { 
    navigator.clipboard.writeText(getExportCode()); 
    alert('📋 소스 코드가 클립보드에 복사되었습니다.'); 
  };

  const updateDeviceOrder = (id: string, order: number) => setDevices(devices.map(d => d.id === id ? { ...d, order } : d));
  const updateDevicePrice = (id: string, price: number) => setDevices(devices.map(d => d.id === id ? { ...d, price } : d));
  const updateDeviceCategory = (id: string, category: DeviceCategory) => setDevices(devices.map(d => d.id === id ? { ...d, category } : d));
  const updatePlanPrice = (id: string, price: number) => setPlans(plans.map(p => p.id === id ? { ...p, price } : p));
  const updateSubsidy = (planId: string, deviceId: string, value: number) => setPlans(plans.map(p => p.id === planId ? { ...p, subsidy: { ...p.subsidy, [deviceId]: value } } : p));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === 'just208' && loginPw === 'skbnt082') { setIsAdmin(true); setShowLogin(false); setLoginId(''); setLoginPw(''); }
    else { alert('아이디 또는 비밀번호가 올바르지 않습니다.'); }
  };

  const handleSecretLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretPw === SECRET_PASSWORD) {
        setIsSecretUnlocked(true);
        setSecretPw('');
    } else {
        alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const resetData = () => { if (confirm('⚠️ 모든 데이터를 초기 설정으로 되돌리시겠습니까?')) { localStorage.removeItem(STORAGE_KEY_DEVICES); localStorage.removeItem(STORAGE_KEY_PLANS); window.location.reload(); } };

  // Common Modal Component for Forms (팝업 창 컴포넌트)
  const EmbedModal = ({ isOpen, onClose, title, url }: { isOpen: boolean; onClose: () => void; title: string; url: string }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-[2rem] w-full max-w-2xl h-[90vh] shadow-2xl flex flex-col overflow-hidden relative">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><i className="fas fa-paper-plane text-[#E2000F]"></i> {title}</h3>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition-colors">
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
          <div className="flex-1 w-full h-full bg-slate-50">
             <iframe src={url} className="w-full h-full border-0" title={title}></iframe>
          </div>
        </div>
      </div>
    );
  };

  if (!results) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-red-100 selection:text-red-900 pb-12 flex flex-col">
      <header className="bg-white border-b-4 border-[#E2000F] px-6 py-6 sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#E2000F] to-[#F37321] rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg">T</div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">SKT 최적 설계 계산기</h1>
              <p className="text-xs text-[#E2000F] font-black uppercase tracking-widest">Professional AI Consulting</p>
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
               <button onClick={handleManualSave} className="px-6 py-3 rounded-2xl text-sm font-black bg-green-600 text-white transition-all shadow-lg hover:bg-green-700">데이터 저장</button>
               <button onClick={() => setIsAdmin(false)} className="px-6 py-3 rounded-2xl text-sm font-black bg-slate-800 text-white transition-all shadow-md hover:bg-slate-700">관리 종료</button>
            </div>
          )}
        </div>
      </header>

      {/* Admin Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">관리자 로그인</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" placeholder="아이디" className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 focus:border-[#E2000F] outline-none font-bold transition-all" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
              <input type="password" placeholder="비밀번호" className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 focus:border-[#E2000F] outline-none font-bold transition-all" value={loginPw} onChange={(e) => setLoginPw(e.target.value)} />
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowLogin(false)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black hover:bg-slate-200 transition-all">취소</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl bg-[#E2000F] text-white font-black hover:bg-red-700 transition-all shadow-lg">로그인</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* [시스템 수정] Secret Modal (잘림 방지 및 스크롤 개선 적용됨) */}
      {showSecretModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <i className="fas fa-user-secret text-slate-400"></i>
                        관리자 전용 뷰어
                    </h3>
                    <button onClick={() => { setShowSecretModal(false); setIsSecretUnlocked(false); setSecretPw(''); }} className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition-colors">
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50">
                    {!isSecretUnlocked ? (
                        <div className="flex flex-col items-center justify-center h-full p-8 min-h-[300px]">
                            <div className="w-full max-w-sm space-y-6 text-center animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center text-slate-400 mb-4">
                                    <i className="fas fa-lock text-3xl"></i>
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 mb-2">보안 접근 확인</h4>
                                    <p className="text-slate-500 text-sm font-bold">권한이 있는 관리자만 접근할 수 있습니다.</p>
                                </div>
                                <form onSubmit={handleSecretLogin} className="space-y-4">
                                    <input 
                                        type="password" 
                                        placeholder="비밀번호 입력" 
                                        className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 focus:border-[#F37321] outline-none font-black text-center text-lg transition-all" 
                                        value={secretPw} 
                                        onChange={(e) => setSecretPw(e.target.value)} 
                                        autoFocus
                                    />
                                    <button type="submit" className="w-full py-4 rounded-2xl bg-[#F37321] text-white font-black hover:bg-[#d65f1a] transition-all shadow-lg text-lg">
                                        확인
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full animate-in fade-in duration-500">
                            <img 
                                src={SECRET_IMAGE_URL} 
                                alt="Secret Content" 
                                className="w-full h-auto block" 
                                style={{ imageRendering: 'auto' }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
      
      {/* [시스템 수정] Tally 폼 팝업 모달 */}
      <EmbedModal isOpen={showConsultModal} onClose={() => setShowConsultModal(false)} title="상담 신청" url={CONSULT_FORM_URL} />
      <EmbedModal isOpen={showPurchaseModal} onClose={() => setShowPurchaseModal(false)} title="구매 신청" url={PURCHASE_FORM_URL} />


      {isAdmin ? (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
          <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl border-4 border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10"><i className="fas fa-code text-8xl text-white"></i></div>
            <div className="relative z-10">
              <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2"><i className="fas fa-file-code text-blue-400"></i> 시스템 데이터 추출</h2>
              <p className="text-slate-400 text-sm mb-6">현재 설정을 소스 코드 상수에 반영하려면 아래 코드를 복사하세요.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setShowExportModal(true)} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black transition-all flex items-center gap-2 shadow-lg shadow-blue-900/40"><i className="fas fa-eye"></i> 코드 보기</button>
                <button onClick={copyToClipboard} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-black transition-all flex items-center gap-2"><i className="fas fa-copy"></i> 클립보드 복사</button>
              </div>
            </div>
          </div>
          
           <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden">
            <div className="bg-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-200">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><i className="fas fa-mobile-screen text-[#E2000F]"></i> 단말기 관리</h2>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
                <select className="px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-sm focus:border-[#E2000F] outline-none" value={newDeviceCategory} onChange={e => setNewDeviceCategory(e.target.value as DeviceCategory)}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="number" placeholder="순번" className="w-16 px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-sm focus:border-[#E2000F] outline-none" value={newDeviceOrder} onChange={e => setNewDeviceOrder(e.target.value === '' ? '' : Number(e.target.value))} />
                <input type="text" placeholder="모델명" className="flex-1 sm:w-40 px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-sm focus:border-[#E2000F] outline-none" value={newDeviceName} onChange={e => setNewDeviceName(e.target.value)} />
                <input type="number" placeholder="출고가" className="w-28 px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-sm focus:border-[#E2000F] outline-none" value={newDevicePrice} onChange={e => setNewDevicePrice(e.target.value === '' ? '' : Number(e.target.value))} />
                <button onClick={addDevice} className="bg-[#E2000F] text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-md hover:bg-red-700 transition">추가</button>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-base">
                <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                  <tr className="border-b-2 border-slate-100"><th className="px-6 py-4 text-left font-black text-slate-500 w-20 text-center">순번</th><th className="px-6 py-4 text-left font-black text-slate-500">분류</th><th className="px-6 py-4 text-left font-black text-slate-500">모델명</th><th className="px-6 py-4 text-left font-black text-slate-500">출고가</th><th className="px-6 py-4 text-center font-black text-slate-500">동작</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">{sortedDevices.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-center"><input type="number" className="w-14 px-2 py-1 border-2 border-slate-200 rounded-lg text-sm font-black text-center focus:border-[#E2000F]" value={d.order || ''} onChange={(e) => updateDeviceOrder(d.id, Number(e.target.value))} /></td>
                    <td className="px-6 py-4">
                      <select className="px-2 py-1 border-2 border-slate-200 rounded-lg text-xs font-black focus:border-[#E2000F]" value={d.category} onChange={e => updateDeviceCategory(d.id, e.target.value as DeviceCategory)}>
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800">{d.name}</td>
                    <td className="px-6 py-4"><input type="number" className="w-32 px-3 py-1.5 border-2 border-slate-200 rounded-lg text-sm font-black focus:border-[#E2000F]" value={d.price} onChange={(e) => updateDevicePrice(d.id, Number(e.target.value))} /></td>
                    <td className="px-6 py-4 text-center"><button onClick={() => setDevices(devices.filter(x => x.id !== d.id))} className="text-red-400 hover:text-red-600 transition"><i className="fas fa-trash-alt"></i></button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden">
            <div className="bg-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-200">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><i className="fas fa-hand-holding-dollar text-[#F37321]"></i> 요금제/지원금 관리</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <input type="text" placeholder="요금제명" className="flex-1 sm:w-40 px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-sm focus:border-[#F37321] outline-none" value={newPlanName} onChange={e => setNewPlanName(e.target.value)} />
                <input type="number" placeholder="월정액" className="w-28 px-3 py-2 rounded-xl border-2 border-slate-300 font-bold text-sm focus:border-[#F37321] outline-none" value={newPlanPrice} onChange={e => setNewPlanPrice(e.target.value === '' ? '' : Number(e.target.value))} />
                <button onClick={addPlan} className="bg-[#F37321] text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-md hover:bg-[#d65f1a] transition">추가</button>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                  <tr className="border-b-2 border-slate-100">
                    <th className="px-6 py-4 text-left font-black text-slate-500 min-w-[200px] border-r">단말기</th>
                    {sortedPlans.map(p => (
                      <th key={p.id} className="px-4 py-4 text-center font-black text-slate-700 min-w-[140px]">
                        <div className="flex flex-col items-center">
                          <span className="text-[11px] leading-tight mb-2 h-8 flex items-center">{p.name}</span>
                          <input type="number" className="w-full px-2 py-1 border-2 border-slate-200 rounded-lg text-xs font-black text-center mb-2" value={p.price} onChange={(e) => updatePlanPrice(p.id, Number(e.target.value))} />
                          <button onClick={() => setPlans(plans.filter(x => x.id !== p.id))} className="text-slate-300 hover:text-red-500 transition-colors"><i className="fas fa-times-circle"></i></button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">{sortedDevices.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-black text-slate-800 border-r bg-slate-50/50">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-400 font-black">{d.category}</span>
                        <span className="leading-tight">{d.name}</span>
                      </div>
                    </td>
                    {sortedPlans.map(p => (
                      <td key={p.id} className="px-4 py-4 text-center">
                        <input type="number" className="w-full px-2 py-1.5 border-2 border-slate-200 rounded-lg text-xs font-black text-[#E2000F] text-center" value={p.subsidy[d.id] || 0} onChange={(e) => updateSubsidy(p.id, d.id, Number(e.target.value))} />
                      </td>
                    ))}
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
          <div className="text-center pt-4 flex justify-center gap-4">
              <button onClick={handleManualSave} className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black transition-all shadow-lg flex items-center gap-2"><i className="fas fa-save"></i> 현재 설정 저장</button>
              <button onClick={resetData} className="px-8 py-4 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-600 rounded-2xl font-black transition-all flex items-center gap-2"><i className="fas fa-undo"></i> 데이터 초기화</button>
          </div>
           {showExportModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
              <div className="bg-slate-900 text-white rounded-[2rem] w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in duration-300">
                <div className="p-8 border-b border-white/10 flex justify-between items-center">
                  <div><h3 className="text-2xl font-black">시스템 설정 코드 추출</h3><p className="text-slate-400 text-sm">App.tsx 상단의 상수를 아래 내용으로 교체하세요.</p></div>
                  <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-white transition-colors text-3xl">&times;</button>
                </div>
                <div className="p-8 flex-1 overflow-auto">
                  <pre className="bg-black/50 p-6 rounded-2xl text-green-400 text-sm font-mono overflow-x-auto leading-relaxed border border-white/5 select-all whitespace-pre">{getExportCode()}</pre>
                </div>
                <div className="p-8 border-t border-white/10 flex gap-4">
                  <button onClick={copyToClipboard} className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black transition-all shadow-lg"><i className="fas fa-copy mr-2"></i> 전체 코드 복사</button>
                  <button onClick={() => setShowExportModal(false)} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black transition-all">닫기</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <main className="max-w-6xl mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start flex-1">
            <div className="lg:col-span-5 space-y-8">
              <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-slate-100 space-y-6">
                <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-4"><i className="fas fa-check-circle text-[#E2000F] text-xl"></i><h3 className="text-lg font-black text-slate-900 uppercase">기본 조건 설정</h3></div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-black text-slate-500 uppercase tracking-tighter">라인업 선택</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id as DeviceCategory)}
                        className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${userCategory === cat.id ? 'bg-[#E2000F] border-[#E2000F] text-white shadow-lg shadow-red-200' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'}`}
                      >
                        <i className={`fas ${cat.icon} text-lg`}></i>
                        <span className="text-[11px] font-black">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-500 mb-2 uppercase tracking-tighter">단말기 모델</label>
                  <div className="relative">
                    <select 
                      className="w-full px-6 py-4 pr-12 rounded-2xl border-4 border-slate-100 bg-slate-50 font-black text-xl text-slate-900 focus:border-[#E2000F] outline-none transition-all appearance-none cursor-pointer" 
                      value={state.deviceId} 
                      onChange={(e) => setState({...state, deviceId: e.target.value})}
                    >
                      {filteredDevicesForUser.length > 0 ? (
                        filteredDevicesForUser.map(d => <option key={d.id} value={d.id}>{d.name}</option>)
                      ) : (
                        <option disabled>등록된 모델 없음</option>
                      )}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-tighter">납부 방식</label><div className="flex bg-slate-100 p-2 rounded-2xl"><button onClick={() => setState({...state, paymentMethod: PaymentMethod.INSTALLMENT})} className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${state.paymentMethod === PaymentMethod.INSTALLMENT ? 'bg-white shadow-md text-[#E2000F]' : 'text-slate-500'}`}>할부</button><button onClick={() => setState({...state, paymentMethod: PaymentMethod.LUMP_SUM})} className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${state.paymentMethod === PaymentMethod.LUMP_SUM ? 'bg-white shadow-md text-[#E2000F]' : 'text-slate-500'}`}>일시불</button></div></div>
                  <div><label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-tighter">할인 구분</label><div className="flex bg-slate-100 p-2 rounded-2xl"><button onClick={() => setState({...state, discountType: DiscountType.SUBSIDY})} className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${state.discountType === DiscountType.SUBSIDY ? 'bg-white shadow-md text-[#F37321]' : 'text-slate-500'}`}>공시</button><button onClick={() => setState({...state, discountType: DiscountType.CONTRACT})} className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${state.discountType === DiscountType.CONTRACT ? 'bg-white shadow-md text-[#F37321]' : 'text-slate-500'}`}>선약</button></div></div>
                </div>
                
                <div>
                  <label className="block text-sm font-black text-slate-500 mb-2 tracking-tighter">임직원 할인금액을 (원)단위로 입력하세요</label>
                  <input 
                    type="number" 
                    className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 bg-slate-50 font-black text-xl text-slate-900 outline-none focus:border-[#E2000F] transition-all" 
                    value={state.employeeDiscount === 0 ? '' : state.employeeDiscount} 
                    onChange={(e) => setState({...state, employeeDiscount: e.target.value === '' ? 0 : Number(e.target.value)})} 
                    placeholder="0" 
                  />
                  {/* 할인단가표 보기 버튼 */}
                  <div className="mt-2 text-right">
                    <button 
                        onClick={() => setShowSecretModal(true)}
                        className="text-xs font-bold text-slate-400 hover:text-[#E2000F] hover:underline transition-all"
                    >
                        <i className="fas fa-search mr-1"></i>할인단가표 보기
                    </button>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-slate-100 space-y-6">
                <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-4"><i className="fas fa-layer-group text-[#F37321] text-xl"></i><h3 className="text-lg font-black text-slate-900 uppercase">요금제 설계</h3></div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 mb-1 tracking-tighter">유지 요금제 (M+{state.maintenanceMonths})</label>
                    <select 
                      className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-slate-50 font-black text-lg text-slate-900 outline-none" 
                      value={state.initialPlanId} 
                      onChange={(e) => setState({...state, initialPlanId: e.target.value})}
                    >
                      {sortedPlans.map(p => <option key={p.id} value={p.id}>{p.name} ({formatKrw(p.price)})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 mb-1 tracking-tighter">변경 후 요금제</label>
                    <select 
                      className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-slate-50 font-black text-lg text-slate-900 outline-none" 
                      value={state.afterPlanId} 
                      onChange={(e) => setState({...state, afterPlanId: e.target.value})}
                    >
                      {sortedPlans.map(p => <option key={p.id} value={p.id}>{p.name} ({formatKrw(p.price)})</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="bg-slate-50 p-6 rounded-3xl flex items-center justify-between border-2 border-slate-100 cursor-pointer shadow-sm" onClick={() => setState({...state, useFamilyDiscount: !state.useFamilyDiscount})}>
                    <div><h4 className="text-base font-black text-slate-800 transition">SKT 온가족할인 적용</h4><p className="text-[10px] text-slate-400 font-bold">기본료 30% 추가 할인</p></div>
                    <div className={`w-16 h-8 rounded-full relative transition-all duration-300 shadow-inner ${state.useFamilyDiscount ? 'bg-[#E2000F]' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${state.useFamilyDiscount ? 'translate-x-9' : 'translate-x-1'}`}></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm space-y-4">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-base font-black text-slate-800">인터넷 결합할인</h4>
                      <p className="text-[10px] text-slate-400 font-bold leading-tight">요즘가족결합 1~2인 3,500원 / 3인이상 6,000원 할인</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 3500, 6000].map((val) => (
                        <button
                          key={val}
                          onClick={() => setState({...state, internetDiscount: val})}
                          className={`py-3 rounded-2xl text-[11px] font-black transition-all border-2 ${state.internetDiscount === val ? 'bg-[#F37321] border-[#F37321] text-white shadow-md' : 'bg-slate-50 border-slate-50 text-slate-500'}`}
                        >
                          {val === 0 ? '없음' : `${val.toLocaleString()}원`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <section className="bg-gradient-to-br from-[#E2000F] via-[#F37321] to-[#E2000F] rounded-[3rem] p-10 shadow-2xl border-4 border-white/20 relative overflow-hidden text-center text-white">
                <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12"><i className="fas fa-coins text-[8rem]"></i></div>
                <div className="absolute bottom-0 left-0 p-16 opacity-10 -rotate-12"><i className="fas fa-file-invoice-dollar text-[8rem]"></i></div>
                <div className="relative z-10 space-y-8">
                  <div><span className="bg-white/20 backdrop-blur-md text-white text-sm font-black px-6 py-2.5 rounded-full uppercase tracking-widest border border-white/30 shadow-lg inline-block">최종 할부원금</span><div className="text-4xl lg:text-5xl font-black mt-6 tracking-tighter drop-shadow-2xl">{formatKrw(results.principal)}</div><p className="text-xs text-white/70 mt-4 font-bold bg-black/10 px-6 py-2 rounded-full inline-block">출고가 {formatKrw(selectedDevice.price)} {results.subsidy > 0 && ` - 지원금 ${formatKrw(results.subsidy)}`} {state.employeeDiscount > 0 && ` - 임직원할인 ${formatKrw(state.employeeDiscount)}`}</p></div>
                  <div className="flex flex-col items-center justify-center pt-8 border-t-2 border-white/20"><span className="text-white/80 text-sm font-black uppercase tracking-widest mb-1">24개월 총 소요 비용</span><div className="text-3xl lg:text-4xl font-black drop-shadow-sm">{formatKrw(results.total2Year)}</div></div>
                  <div className="grid grid-cols-2 gap-6 pt-2"><div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-inner"><span className="text-white/70 text-xs font-black block mb-2 uppercase tracking-tighter">월 단말기 납부액</span><span className="text-xl lg:text-2xl font-black">{formatKrw(results.monthlyInstallment)}</span></div><div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-inner"><span className="text-white/70 text-xs font-black block mb-2 uppercase tracking-tighter">2년간 총 이자(5.9%)</span><span className="text-xl lg:text-2xl font-black">{formatKrw(results.totalInterest)}</span></div></div>
                  
                  {/* [시스템 수정] 신청 버튼 영역 추가 */}
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/20">
                    <button 
                        onClick={() => setShowConsultModal(true)} 
                        className="py-4 bg-white text-[#E2000F] rounded-2xl font-black text-lg shadow-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-headset"></i> 상담 신청
                    </button>
                    <button 
                        onClick={() => setShowPurchaseModal(true)} 
                        className="py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 border border-white/20"
                    >
                        <i className="fas fa-cart-shopping"></i> 구매 신청
                    </button>
                  </div>
                </div>
              </section>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-2 border-slate-100 flex flex-col h-full relative">
                  <div className="flex items-center gap-3 mb-8"><div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 text-xl shadow-inner"><i className="fas fa-hourglass-start"></i></div><div><h4 className="text-lg font-black text-slate-900">변경 전 {state.maintenanceMonths}개월</h4><p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Initial Fee</p></div></div>
                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between text-sm font-black"><span className="text-slate-500 tracking-tighter">기본료 ({initialPlan.name})</span><span className="text-slate-900">{formatKrw(initialPlan.price)}</span></div>
                    {results.initial.contractDiscount > 0 && (<div className="flex justify-between text-sm font-black text-[#E2000F]"><span className="tracking-tighter">선택약정(25%)</span><span>-{formatKrw(results.initial.contractDiscount)}</span></div>)}
                    {results.initial.familyDiscount > 0 && (<div className="flex justify-between text-sm font-black text-[#F37321]"><span className="tracking-tighter">온가족할인(30%)</span><span>-{formatKrw(results.initial.familyDiscount)}</span></div>)}
                    {results.initial.internetDiscount > 0 && (<div className="flex justify-between text-sm font-black text-[#F37321]"><span className="tracking-tighter">유선결합할인</span><span>-{formatKrw(results.initial.internetDiscount)}</span></div>)}
                    <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-50"><span className="text-slate-500 tracking-tighter">단말기 할부금</span><span className="text-slate-900">{formatKrw(results.monthlyInstallment)}</span></div>
                  </div>
                  <div className="mt-8 pt-6 border-t-4 border-slate-100 flex justify-between items-end gap-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">월 예상 납부액</span><span className="text-xl lg:text-2xl font-black text-slate-900 leading-none whitespace-nowrap">{formatKrw(results.initial.total)}</span></div>
                </div>
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-4 border-[#E2000F]/20 flex flex-col h-full relative">
                  <div className="absolute top-0 right-0 bg-[#E2000F] text-white text-[10px] font-black px-5 py-2 rounded-bl-2xl shadow-md">OPTIMAL DESIGN</div>
                  <div className="flex items-center gap-3 mb-8"><div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-[#E2000F] text-xl shadow-inner"><i className="fas fa-check-double"></i></div><div><h4 className="text-lg font-black text-slate-900">변경 후 {24 - state.maintenanceMonths}개월</h4><p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Post-Period Fee</p></div></div>
                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between text-sm font-black"><span className="text-slate-500 tracking-tighter">기본료 ({afterPlan.name})</span><span className="text-slate-900">{formatKrw(afterPlan.price)}</span></div>
                    {results.after.contractDiscount > 0 && (<div className="flex justify-between text-sm font-black text-[#E2000F]"><span className="tracking-tighter">선택약정(25%)</span><span>-{formatKrw(results.after.contractDiscount)}</span></div>)}
                    {results.after.familyDiscount > 0 && (<div className="flex justify-between text-sm font-black text-[#F37321]"><span className="tracking-tighter">온가족할인(30%)</span><span>-{formatKrw(results.after.familyDiscount)}</span></div>)}
                    {results.after.internetDiscount > 0 && (<div className="flex justify-between text-sm font-black text-[#F37321]"><span className="tracking-tighter">유선결합할인</span><span>-{formatKrw(results.after.internetDiscount)}</span></div>)}
                    <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-50"><span className="text-slate-500 tracking-tighter">단말기 할부금</span><span className="text-slate-900">{formatKrw(results.monthlyInstallment)}</span></div>
                  </div>
                  <div className="mt-8 pt-6 border-t-4 border-[#E2000F]/10 flex justify-between items-end gap-2"><span className="text-[10px] font-black text-[#E2000F] uppercase tracking-widest leading-none mb-1">월 예상 납부액</span><span className="text-xl lg:text-2xl font-black text-[#E2000F] leading-none whitespace-nowrap">{formatKrw(results.after.total)}</span></div>
                </div>
              </div>
            </div>
          </main>

          {/* Precautions Section */}
          <section className="max-w-6xl mx-auto px-6 mt-4 mb-4">
            <div className="bg-slate-50 rounded-[2rem] p-8 border-2 border-slate-100 shadow-sm">
              <div className="flex gap-4">
                <div className="text-slate-400 mt-1">
                  <i className="fas fa-circle-info text-2xl"></i>
                </div>
                <div className="flex-1">
                  <h5 className="text-base font-black text-slate-800 mb-3 uppercase tracking-tighter">유의사항</h5>
                  <p className="text-sm text-slate-500 font-bold leading-relaxed">
                    ※ 공시지원금할인은 6개월(183일) 이후 5G단말기 42,000원 미만 / LTE단말기는 20,000원 미만으로 변경 시 공시지원금 차액이 위약금으로 청구 됩니다.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <footer className="max-w-6xl mx-auto px-6 mt-12 mb-12 text-center relative">
        <div className="w-20 h-2 bg-gradient-to-r from-[#E2000F] to-[#F37321] mx-auto rounded-full mb-6 shadow-sm opacity-50"></div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">SK TELECOM SALES CONSULTING • PROFESSIONAL v4.3</p>
        <button onClick={() => isAdmin ? setIsAdmin(false) : setShowLogin(true)} className="absolute right-6 bottom-0 text-slate-300 pointer-events-auto hover:text-slate-500 transition-colors" title="관리자 설정"><i className="fas fa-cog text-lg"></i></button>
      </footer>
    </div>
  );
};

export default App;