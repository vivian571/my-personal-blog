import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '留言板',
  description: '欢迎留下你的足迹。',
};

export default function GuestbookPage() {
  return (
    <section>
      <h1 className="font-bold text-3xl mb-8 tracking-tighter text-[var(--text-primary)]">留言板</h1>
      <div className="w-full">
        <p className="mb-8 text-[var(--text-secondary)] leading-relaxed">
          欢迎留下你的足迹。无论是建议、感悟，还是简单的问候，都可以在这里畅所欲言。
        </p>
        
        <div className="my-8 p-4 rounded-lg bg-[var(--text-secondary)]/5 border border-dashed border-[var(--border)]">
          <p className="text-sm text-[var(--text-secondary)]/80 text-center">
            🚧 留言功能正在升级维护中，敬请期待...
          </p>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between w-full space-x-2">
              <span className="text-sm font-bold text-[var(--text-primary)]">shanghai_walker</span>
              <span className="text-xs text-[var(--text-secondary)]/60">今天</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm">
              路过，网站的设计很有质感！🚀
            </p>
          </div>
          
          <div className="w-full h-px bg-[var(--border)]" />

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between w-full space-x-2">
              <span className="text-sm font-bold text-[var(--text-primary)]">code_poet</span>
              <span className="text-xs text-[var(--text-secondary)]/60">昨天</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm">
              文字和代码的结合，很有意思。期待更多更新。
            </p>
          </div>

          <div className="w-full h-px bg-[var(--border)]" />

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between w-full space-x-2">
              <span className="text-sm font-bold text-[var(--text-primary)]">coffee_lover</span>
              <span className="text-xs text-[var(--text-secondary)]/60">3 天前</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm">
              早安！☕️ 又是充满活力的一天。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
