# Reflection lifecycle

1. 実行開始時にAgent slug、trigger、親run、開始時刻を記録する。
2. 判断中は入力と出力のprovenanceを保持する。
3. 完了時にstatus、終了時刻、実施内容、品質確認、改善候補を記録する。
4. 失敗・timeout・blockedを成功として記録しない。

DB書込の実装方法はAgent定義へ埋め込まず、runtime Capabilityへ委譲します。
