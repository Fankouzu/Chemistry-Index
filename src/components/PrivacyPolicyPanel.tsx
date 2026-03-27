import React, { useEffect } from 'react';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Offline privacy policy bundled with the app (no network).
 * Keep in substance sync with PRIVACY.md (English) when either changes.
 */
export const PrivacyPolicyPanel: React.FC<Props> = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
      onClick={onClose}
    >
      <div
        className="mx-auto mt-[max(0.75rem,env(safe-area-inset-top))] mb-[max(0.75rem,env(safe-area-inset-bottom))] flex h-[min(92vh,calc(100dvh-1.5rem))] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <h2
            id="privacy-policy-title"
            className="text-lg font-bold text-gray-900 dark:text-white"
          >
            隐私政策
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors [touch-action:manipulation] hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-label="关闭"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            最后更新：2026 年 3 月 · 本说明随应用安装，无需联网即可阅读。
          </p>
          <p className="mb-4">
            Chemistry Index（「本应用」）用于浏览与练习初中化学方程式，属教育类工具。
          </p>
          <h3 className="mb-2 mt-6 text-base font-semibold text-gray-900 dark:text-white">
            我们收集的信息
          </h3>
          <p className="mb-4">
            本应用<strong>不</strong>提供账号系统，未集成分析统计与广告 SDK；不会将您的学习数据上传至我们的服务器。
          </p>
          <h3 className="mb-2 mt-6 text-base font-semibold text-gray-900 dark:text-white">
            仅保存在您设备上的数据
          </h3>
          <p className="mb-2">本应用可能仅在您的设备上使用本地存储（如 localStorage）保存：</p>
          <ul className="mb-4 list-disc space-y-1 pl-5">
            <li>
              <strong>显示偏好</strong>：例如浅色 / 深色主题；
            </li>
            <li>
              <strong>收藏</strong>：您标记为收藏的方程式标识。
            </li>
          </ul>
          <p className="mb-4">
            上述数据保存在本机，清除应用数据或卸载后将删除。除非您自行修改应用并接入第三方服务，否则我们不会收到这些信息。
          </p>
          <h3 className="mb-2 mt-6 text-base font-semibold text-gray-900 dark:text-white">
            网络与单机使用
          </h3>
          <p className="mb-4">
            核心功能（浏览方程式、配平练习、本隐私说明）均可<strong>完全离线</strong>使用。系统或 WebView
            可能因平台原因具备网络能力；当前开源版本<strong>不依赖</strong>自有后端即可完成上述功能。若您日后增加联网能力（如
            AI、云同步），请在应用内与商店资料中同步更新说明。
          </p>
          <h3 className="mb-2 mt-6 text-base font-semibold text-gray-900 dark:text-white">
            儿童与未成年人
          </h3>
          <p className="mb-4">
            本应用面向教育场景。若您面向特定地区分发，请根据当地法律（如 COPPA 等）自行评估并更新本政策。
          </p>
          <h3 className="mb-2 mt-6 text-base font-semibold text-gray-900 dark:text-white">
            联系我们
          </h3>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            上架前请替换为实际支持邮箱或网站；用户也可通过应用商店页面与您联系。
          </p>
          <h3 className="mb-2 mt-6 text-base font-semibold text-gray-900 dark:text-white">
            政策变更
          </h3>
          <p className="mb-2">
            当本应用功能或数据处理方式发生变化时，我们会更新本说明及文首的「最后更新」日期。如涉及对用户有重大影响的变更，我们将在适用法律要求的范围内，通过应用内提示、应用商店说明或其他合理方式告知。
          </p>
        </div>
      </div>
    </div>
  );
};
