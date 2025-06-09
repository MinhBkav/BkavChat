export const Checkbox = () =>
{
 return (
     <label class="relative inline-flex cursor-pointer items-center">
  <input type="checkbox" class="peer sr-only" />
  <div class="peer h-6 w-11 rounded-full bg-gray-300 transition-colors duration-300 peer-checked:bg-gray-500"></div>
  <div class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-all duration-300 peer-checked:translate-x-5"></div>
</label>
 )
}
export default Checkbox;