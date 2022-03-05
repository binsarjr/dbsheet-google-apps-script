/*
 * Name      : Database Sheet Library
 * Versi     : 1
 * Release   : <Realese>
 *
 * Programmer: Binsar Dwi Jasuma
 * Telegram  : @binsardj
 * Email     : binsarjr@gmail.com
 *
 * Script ID: <1tUYrcbPcf16xUcIG0ga8ey59NPZNCqlwBCJIgonErrRtPewC8rIvWg3N>
 *
 * Fungsi: menjadikan spreadsheet sebagai database
 *
 * Support Grup Telegram @botindonesia
 * Diskusi dan sharing di sana ya!
 *
 */
function init(sheetId) {
  return new Database(sheetId)
}
